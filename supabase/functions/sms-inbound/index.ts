import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const form = await req.formData();
    
    const from = form.get('From')?.toString();
    const body = form.get('Body')?.toString()?.trim().toUpperCase();
    
    console.log('Inbound SMS:', { from, body });

    if (!from || !body) {
      return new Response('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
        headers: { ...corsHeaders, 'Content-Type': 'text/xml' }
      });
    }

    // Handle STOP/UNSUBSCRIBE
    if (body === 'STOP' || body === 'UNSUBSCRIBE' || body === 'CANCEL') {
      const { error } = await supabase
        .from('user_profiles')
        .update({ consent_comms: false })
        .eq('phone', from);

      if (error) {
        console.error('Error setting consent_comms:', error);
      } else {
        console.log(`User ${from} opted out via SMS`);
        
        // Log audit
        await supabase.from('admin_audit_logs').insert({
          action: 'sms_opt_out',
          target_type: 'user_profile',
          metadata: { phone: from, method: 'inbound_sms' }
        });
      }

      return new Response(
        '<?xml version="1.0" encoding="UTF-8"?><Response><Message>You have been unsubscribed from SMS notifications. Reply START to opt back in.</Message></Response>',
        { headers: { ...corsHeaders, 'Content-Type': 'text/xml' } }
      );
    }

    // Handle START/SUBSCRIBE
    if (body === 'START' || body === 'SUBSCRIBE' || body === 'YES') {
      const { error } = await supabase
        .from('user_profiles')
        .update({ consent_comms: true })
        .eq('phone', from);

      if (error) {
        console.error('Error setting consent_comms:', error);
      } else {
        console.log(`User ${from} opted in via SMS`);
        
        await supabase.from('admin_audit_logs').insert({
          action: 'sms_opt_in',
          target_type: 'user_profile',
          metadata: { phone: from, method: 'inbound_sms' }
        });
      }

      return new Response(
        '<?xml version="1.0" encoding="UTF-8"?><Response><Message>You have been subscribed to NBA 2K Protocol notifications. Reply STOP to unsubscribe.</Message></Response>',
        { headers: { ...corsHeaders, 'Content-Type': 'text/xml' } }
      );
    }

    // Handle HELP
    if (body === 'HELP' || body === 'INFO') {
      const supportEmail = Deno.env.get('VITE_SUPPORT_EMAIL') || 'streamersupport@planetcuhz.com';
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?><Response><Message>NBA 2K Protocol: Match notifications. Reply STOP to unsubscribe. Support: ${supportEmail}</Message></Response>`,
        { headers: { ...corsHeaders, 'Content-Type': 'text/xml' } }
      );
    }

    // Default: ignore other messages
    return new Response('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
      headers: { ...corsHeaders, 'Content-Type': 'text/xml' }
    });
  } catch (e) {
    console.error('SMS inbound webhook error:', e);
    return new Response('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/xml' }
    });
  }
});
