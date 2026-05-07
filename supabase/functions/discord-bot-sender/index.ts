import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const DISCORD_BOT_TOKEN = Deno.env.get('DISCORD_BOT_TOKEN')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // JWT Authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error('[discord-bot-sender] No authorization header');
      return new Response(
        JSON.stringify({ ok: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('[discord-bot-sender] Auth failed:', authError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const { data: allowed } = await supabase.rpc('check_rate_limit', {
      p_identifier: ip,
      p_action_type: 'discord_bot_send',
      p_max_requests: 30,
      p_window_minutes: 15
    });

    if (!allowed) {
      console.warn('[discord-bot-sender] Rate limit exceeded for IP:', ip);
      return new Response(
        JSON.stringify({ ok: false, error: 'Rate limit exceeded' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { discordUserId, embed, matchId } = await req.json();

    if (!discordUserId || !embed) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Missing discordUserId or embed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create DM channel
    const dmRes = await fetch('https://discord.com/api/v10/users/@me/channels', {
      method: 'POST',
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipient_id: discordUserId }),
    });

    if (!dmRes.ok) {
      const error = await dmRes.text();
      console.error('Failed to create DM channel:', error);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to create DM channel' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const dmChannel = await dmRes.json();

    // Send message with buttons
    const components = matchId
      ? [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 3,
                label: 'Accept',
                custom_id: `accept:${matchId}`,
                emoji: { name: '✅' },
              },
              {
                type: 2,
                style: 4,
                label: 'Decline',
                custom_id: `decline:${matchId}`,
                emoji: { name: '✖️' },
              },
            ],
          },
        ]
      : undefined;

    const messageRes = await fetch(
      `https://discord.com/api/v10/channels/${dmChannel.id}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          embeds: [embed],
          components,
        }),
      }
    );

    if (!messageRes.ok) {
      const error = await messageRes.text();
      console.error('Failed to send DM:', error);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to send DM' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Discord DM sent successfully to', discordUserId);

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Discord bot sender error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
