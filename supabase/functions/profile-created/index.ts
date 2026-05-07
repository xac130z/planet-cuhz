import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const N8N_WEBHOOK_URL = Deno.env.get('N8N_WEBHOOK_URL');
const N8N_SIGNING_SECRET = Deno.env.get('N8N_SIGNING_SECRET');

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization",
};

// HMAC signature using Deno native crypto API
async function signPayload(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(payload);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `sha256=${hashHex}`;
}

// Retry with exponential backoff
async function postWithRetry(url: string, body: string, headers: Record<string, string>, attempts = 3) {
  const backoffs = [250, 1000, 3000]; // ms
  let lastError = null;

  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
      });

      if (response.ok) {
        return { success: true, response: await response.text() };
      }

      lastError = `HTTP ${response.status}: ${await response.text()}`;
    } catch (error) {
      lastError = String(error);
    }

    if (i < attempts - 1) {
      await new Promise(resolve => setTimeout(resolve, backoffs[i]));
    }
  }

  return { success: false, error: lastError };
}

// Fallback: Send welcome email/SMS directly
async function sendWelcomeFallback(supabase: any, userId: string) {
  console.log('n8n failed, using fallback SendGrid/Twilio');

  // Fetch user profile and prefs
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('display_name, email, phone, consent_comms, preferred_contact')
    .eq('user_id', userId)
    .single();

  if (!profile || !profile.consent_comms) {
    console.log('User opted out or no profile');
    return;
  }

  const SUPPORT_EMAIL = Deno.env.get('VITE_SUPPORT_EMAIL') || 'streamersupport@planetcuhz.com';
  const APP_URL = Deno.env.get('NEXT_PUBLIC_APP_URL') || 'https://planetcuhz.com';
  const TEMPLATE_WELCOME = Deno.env.get('SENDGRID_TEMPLATE_WELCOME');

  // Send email if opted in
  if (profile.email && (profile.preferred_contact === 'email' || profile.preferred_contact === 'both')) {
    try {
      const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SERVICE_KEY}`
        },
        body: JSON.stringify({
          to: profile.email,
          templateId: TEMPLATE_WELCOME || 'd-default',
          dynamicData: {
            display_name: profile.display_name,
            finder_url: `${APP_URL}/protocol/lfg`,
            support_email: SUPPORT_EMAIL,
          },
        }),
      });

      await supabase.from('comms_logs').insert({
        user_id: userId,
        event_type: 'welcome',
        channel: 'email',
        status: 'sent',
        provider: 'sendgrid_fallback',
      });
    } catch (e) {
      console.error('Email fallback failed:', e);
    }
  }

  // Send SMS if opted in
  if (profile.phone && (profile.preferred_contact === 'sms' || profile.preferred_contact === 'both')) {
    try {
      const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      await fetch(`${SUPABASE_URL}/functions/v1/send-sms`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SERVICE_KEY}`
        },
        body: JSON.stringify({
          to: profile.phone,
          body: `NBA 2K Protocol: Your profile is live! Find your squad at ${APP_URL}/protocol/lfg — Reply STOP to opt out`,
        }),
      });

      await supabase.from('comms_logs').insert({
        user_id: userId,
        event_type: 'welcome',
        channel: 'sms',
        status: 'sent',
        provider: 'twilio_fallback',
      });
    } catch (e) {
      console.error('SMS fallback failed:', e);
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ ok: false, error: 'user_id required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if welcome already sent (idempotency)
    const { data: existingLog } = await supabase
      .from('comms_logs')
      .select('id')
      .eq('user_id', user_id)
      .eq('event_type', 'welcome')
      .limit(1)
      .maybeSingle();

    if (existingLog) {
      console.log(`Welcome already sent to ${user_id}`);
      return new Response(
        JSON.stringify({ ok: true, status: 'already_sent' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user data for n8n
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('display_name, email, phone, consent_comms, preferred_contact, digest_cadence, timezone')
      .eq('user_id', user_id)
      .single();

    if (!profile) {
      return new Response(
        JSON.stringify({ ok: false, error: 'profile_not_found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload = JSON.stringify({
      event: 'profile.created',
      user_id,
      profile: {
        display_name: profile.display_name,
        email: profile.email,
        phone: profile.phone,
        consent_comms: profile.consent_comms,
        preferred_contact: profile.preferred_contact,
        digest_cadence: profile.digest_cadence,
        timezone: profile.timezone,
      },
      timestamp: new Date().toISOString(),
    });

    // Try n8n webhook
    if (N8N_WEBHOOK_URL && N8N_SIGNING_SECRET) {
      const signature = await signPayload(payload, N8N_SIGNING_SECRET);
      const headers = {
        'Content-Type': 'application/json',
        'X-CUHZ-Event': 'profile.created',
        'X-CUHZ-Signature': signature,
      };

      const result = await postWithRetry(N8N_WEBHOOK_URL, payload, headers);

      if (result.success) {
        console.log('n8n webhook successful');
        await supabase.from('comms_logs').insert({
          user_id,
          event_type: 'welcome',
          channel: 'n8n',
          status: 'sent',
          provider: 'n8n',
          metadata: { response: result.response },
        });

        return new Response(
          JSON.stringify({ ok: true, status: 'n8n_delivered' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.error('n8n webhook failed:', result.error);
    }

    // Fallback to direct SendGrid/Twilio
    await sendWelcomeFallback(supabase, user_id);

    return new Response(
      JSON.stringify({ ok: true, status: 'fallback_delivered' }),
      { status: 202, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('profile-created error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
