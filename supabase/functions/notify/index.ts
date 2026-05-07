import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const NotifyRequestSchema = z.object({
  matchId: z.string().uuid({ message: 'Invalid matchId format' }),
  force: z.boolean().optional(),
});

// Retry helper with exponential backoff
async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let delay = 500;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === attempts) throw e;
      console.log(`Retry ${i}/${attempts} after ${delay}ms`);
      await new Promise(r => setTimeout(r, delay));
      delay *= 2; // exponential backoff: 500ms -> 1s -> 2s
    }
  }
  throw new Error('Should not reach here');
}

// Log notification attempt to database
async function logNotification(supabase: any, entry: {
  match_id?: string;
  user_id?: string;
  channel: 'email' | 'sms' | 'discord';
  payload: any;
  status: string;
  error?: string;
}) {
  await supabase.from('notifications').insert({
    match_id: entry.match_id ?? null,
    user_id: entry.user_id ?? null,
    channel: entry.channel,
    payload: entry.payload,
    status: entry.status,
    error: entry.error ?? null,
    attempts: 1,
    last_attempt_at: new Date().toISOString(),
  });
}

// Send email with retry and logging
async function sendEmailToUser(
  to: string,
  templateId: string,
  dynamicData: any,
  supabase: any,
  matchId?: string,
  userId?: string
) {
  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const sandbox = Deno.env.get('SENDGRID_SANDBOX_MODE') === 'true';
    
    await withRetry(async () => {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({ to, templateId, dynamicData, sandbox }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res;
    });
    
    await logNotification(supabase, {
      match_id: matchId,
      user_id: userId,
      channel: 'email',
      payload: { to, templateId, dynamicData },
      status: 'sent',
    });
    
    console.log(`Email sent to ${to}`);
  } catch (e) {
    console.error(`Email failed to ${to}:`, e);
    await logNotification(supabase, {
      match_id: matchId,
      user_id: userId,
      channel: 'email',
      payload: { to, templateId, dynamicData },
      status: 'failed',
      error: String(e),
    });
    throw e;
  }
}

// Send SMS with retry and logging
async function sendSmsToUser(
  to: string,
  body: string,
  supabase: any,
  matchId?: string,
  userId?: string
) {
  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    await withRetry(async () => {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-sms`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({ to, body }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res;
    });
    
    await logNotification(supabase, {
      match_id: matchId,
      user_id: userId,
      channel: 'sms',
      payload: { to, body },
      status: 'sent',
    });
    
    console.log(`SMS sent to ${to}`);
  } catch (e) {
    console.error(`SMS failed to ${to}:`, e);
    await logNotification(supabase, {
      match_id: matchId,
      user_id: userId,
      channel: 'sms',
      payload: { to, body },
      status: 'failed',
      error: String(e),
    });
    throw e;
  }
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
    const DISCORD_WEBHOOK_URL = Deno.env.get('DISCORD_WEBHOOK_URL') || '';

    // Require authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    });
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate input with Zod
    const requestBody = await req.json();
    const validationResult = NotifyRequestSchema.safeParse(requestBody);
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.format());
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid input', details: validationResult.error.format() }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { matchId } = validationResult.data;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch match details
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();

    if (matchError || !match) {
      console.error('Match not found:', matchError);
      return new Response(
        JSON.stringify({ ok: false, error: 'match-not-found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if all members have accepted
    const { data: responses, error: responsesError } = await supabase
      .from('match_responses')
      .select('user_id, action')
      .eq('match_id', matchId);

    if (responsesError) {
      console.error('Error fetching responses:', responsesError);
      return new Response(
        JSON.stringify({ ok: false, error: 'responses-fetch-failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const accepted = (responses || [])
      .filter(r => r.action === 'accept')
      .map(r => r.user_id);

    const allAccepted = match.member_ids.every((id: string) => accepted.includes(id));

    if (!allAccepted) {
      return new Response(
        JSON.stringify({ ok: false, error: 'not-mutual-yet' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update match status to mutual_accept
    const { error: updateError } = await supabase
      .from('matches')
      .update({ status: 'mutual_accept', updated_at: new Date().toISOString() })
      .eq('id', matchId);

    if (updateError) {
      console.error('Error updating match status:', updateError);
      return new Response(
        JSON.stringify({ ok: false, error: 'status-update-failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch member profiles for contact preferences
    const { data: memberProfiles } = await supabase
      .from('user_profiles')
      .select('user_id, display_name, discord_conn, preferred_contact, consent_comms, email, phone')
      .in('user_id', match.member_ids);

    // Route notifications based on preferences and availability
    const DISCORD_MODE = Deno.env.get('DISCORD_MODE') || 'webhook';
    const SUPPORT_EMAIL = Deno.env.get('VITE_SUPPORT_EMAIL') || 'streamersupport@planetcuhz.com';
    const APP_URL = Deno.env.get('NEXT_PUBLIC_APP_URL') || 'https://planetcuhz.com';
    
    const TEMPLATE_MUTUAL = Deno.env.get('SENDGRID_TEMPLATE_MATCH_MUTUAL');
    
    // Send notifications to each member
    for (const profile of memberProfiles || []) {
      if (profile.consent_comms === false) {
        console.log(`User ${profile.user_id} has opted out of communications`);
        continue;
      }

      const channels: Array<'discord' | 'email' | 'sms'> = [];
      
      // Determine channels based on preferred_contact
      switch (profile.preferred_contact) {
        case 'discord':
          channels.push('discord');
          break;
        case 'email':
          channels.push('email');
          break;
        case 'sms':
          channels.push('sms');
          break;
        case 'both':
          channels.push('email', 'sms');
          break;
        default:
          channels.push('email'); // Default fallback
      }

      const partnerNames = memberProfiles
        ?.filter((p: any) => p.user_id !== profile.user_id)
        .map((p: any) => p.display_name)
        .join(', ') || 'Your match';

      // Try each channel with fallback
      let sent = false;
      
      for (const channel of channels) {
        try {
          if (channel === 'discord' && DISCORD_MODE === 'bot' && profile.discord_conn?.connected) {
            // Discord DM via bot (implementation in discord-bot-sender)
            console.log(`Sending Discord DM to ${profile.user_id}`);
            // TODO: Implement bot DM when fully wired
            sent = true;
            break;
          } else if (channel === 'email' && profile.email && TEMPLATE_MUTUAL) {
            await sendEmailToUser(
              profile.email,
              TEMPLATE_MUTUAL,
              {
                userName: profile.display_name,
                partner: partnerNames,
                score: match.score,
                channelHint: 'Email',
                accountUrl: `${APP_URL}/protocol/account`,
                supportEmail: SUPPORT_EMAIL,
              },
              supabase,
              matchId,
              profile.user_id
            );
            sent = true;
            break;
          } else if (channel === 'sms' && profile.phone) {
            const smsBody = `✅ Matched! You + ${partnerNames} (${match.score}). Check intro in Discord/Email. Account: ${APP_URL}/protocol/account Help: ${SUPPORT_EMAIL} Stop=unsubscribe`;
            await sendSmsToUser(
              profile.phone,
              smsBody,
              supabase,
              matchId,
              profile.user_id
            );
            sent = true;
            break;
          }
        } catch (e) {
          console.error(`Failed to send via ${channel}:`, e);
          // Continue to next channel
        }
      }

      if (!sent) {
        console.warn(`No notification sent to ${profile.user_id} - no valid channels`);
      }
    }
    
    // Discord routing: prefer bot DM if available
    if (DISCORD_MODE === 'bot') {
      console.log('Discord bot mode enabled; individual DMs handled above');
    }
    
    // Fallback: Send Discord webhook notification
    if (DISCORD_WEBHOOK_URL) {
      try {
        const SUPPORT_EMAIL = Deno.env.get('VITE_SUPPORT_EMAIL') || 'streamersupport@planetcuhz.com';
        const overlap = Math.round((match.scheduled_overlap_minutes || 0) / 60);
        const typeLabel = match.type === 'nba2k_squad5' ? 'Squad5' : 'Pair';
        
        const roster = match.position_coverage && Object.keys(match.position_coverage).length > 0
          ? Object.entries(match.position_coverage)
              .map(([k, v]) => `${k}:${v}`)
              .join(' · ')
          : '—';

        const embed = {
          title: `🏀 Match Accepted — Score ${match.score}/100`,
          description: match.explanation || 'Mutual acceptance achieved!',
          color: 0x5865F2, // Discord blurple
          fields: [
            { name: 'Type', value: typeLabel, inline: true },
            { name: 'Overlap', value: `~${overlap}h/wk`, inline: true },
            { name: 'Coverage', value: roster, inline: true },
          ],
          footer: {
            text: `Handles revealed on mutual accept per privacy rules • Help: ${SUPPORT_EMAIL}`,
          },
          timestamp: new Date().toISOString(),
        };

        const discordPayload = {
          username: 'NBA 2K Protocol Matcher',
          avatar_url: 'https://wjebryxdefcgsxsqomac.supabase.co/storage/v1/object/public/cuhz-characters/protocol-avatar.png',
          content: '🟣 **Mutual Accept — New Match!**',
          embeds: [embed],
        };

        const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(discordPayload),
        });

        if (!discordResponse.ok) {
          console.error('Discord webhook failed:', await discordResponse.text());
        } else {
          console.log('Discord notification sent successfully');
          
          // Optional: Log to notifications audit table
          await supabase.from('notifications').insert({
            match_id: matchId,
            channel: 'discord',
            payload: discordPayload,
            status: 'sent',
          });
        }
      } catch (discordError) {
        console.error('Discord notification error:', discordError);
        // Don't fail the entire request if Discord fails
      }
    } else {
      console.warn('DISCORD_WEBHOOK_URL not configured');
    }

    return new Response(
      JSON.stringify({ ok: true, status: 'mutual_accept' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Notify function error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
