import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { verify } from 'https://deno.land/x/djwt@v3.0.1/mod.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const DISCORD_PUBLIC_KEY = Deno.env.get('DISCORD_PUBLIC_KEY')!;
const DISCORD_BOT_TOKEN = Deno.env.get('DISCORD_BOT_TOKEN')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Verify Discord signature
async function verifyDiscordRequest(req: Request): Promise<boolean> {
  const signature = req.headers.get('X-Signature-Ed25519');
  const timestamp = req.headers.get('X-Signature-Timestamp');
  if (!signature || !timestamp) return false;

  const body = await req.text();
  const message = timestamp + body;

  try {
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(message);
    const signatureBytes = hexToBytes(signature);
    const keyBytes = hexToBytes(DISCORD_PUBLIC_KEY);

    const key = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'Ed25519', namedCurve: 'Ed25519' },
      false,
      ['verify']
    );

    return await crypto.subtle.verify('Ed25519', key, signatureBytes, messageBytes);
  } catch {
    return false;
  }
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

serve(async (req) => {
  // Verify signature
  if (!(await verifyDiscordRequest(req.clone()))) {
    return new Response('Invalid signature', { status: 401 });
  }

  // Rate limiting for Discord interactions
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const { data: allowed } = await supabase.rpc('check_rate_limit', {
    p_identifier: ip,
    p_action_type: 'discord_interaction',
    p_max_requests: 60,
    p_window_minutes: 15
  });

  if (!allowed) {
    console.warn('[discord-interactions] Rate limit exceeded for IP:', ip);
    return new Response(
      JSON.stringify({
        type: 4,
        data: { content: 'Rate limit exceeded. Please try again later.', flags: 64 }
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 429 }
    );
  }

  const body = await req.json();

  // Handle PING
  if (body.type === 1) {
    return new Response(JSON.stringify({ type: 1 }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Handle button interactions
  if (body.type === 3 && body.data?.custom_id) {
    const customId = body.data.custom_id as string;
    const parts = customId.split(':');
    if (parts.length !== 2) {
      return new Response(
        JSON.stringify({
          type: 4,
          data: { content: 'Invalid button ID', flags: 64 },
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    const [action, matchId] = parts;
    const discordUserId = body.member?.user?.id || body.user?.id;

    // Find user by Discord ID
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('user_id, profile')
      .filter('profile->global->discord_conn->>userId', 'eq', discordUserId);

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({
          type: 4,
          data: {
            content: '⚠️ Discord account not linked. Use `/link` to connect.',
            flags: 64,
          },
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = profiles[0].user_id;

    // Check if banned
    const { data: ban } = await supabase
      .from('ban_list')
      .select('*')
      .eq('user_id', userId)
      .or('expires_at.is.null,expires_at.gt.now()')
      .maybeSingle();

    if (ban) {
      return new Response(
        JSON.stringify({
          type: 4,
          data: {
            content: `⛔ You are banned. Reason: ${ban.reason}. Contact streamersupport@planetcuhz.com`,
            flags: 64,
          },
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify user is part of match
    const { data: match } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();

    if (!match || !match.member_ids.includes(userId)) {
      return new Response(
        JSON.stringify({
          type: 4,
          data: { content: '❌ Match not found or you are not a member.', flags: 64 },
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insert/update response
    await supabase
      .from('match_responses')
      .upsert({
        match_id: matchId,
        user_id: userId,
        action,
      });

    // Check if mutual accept
    const { data: responses } = await supabase
      .from('match_responses')
      .select('user_id, action')
      .eq('match_id', matchId);

    const accepted = (responses || [])
      .filter((r) => r.action === 'accept')
      .map((r) => r.user_id);
    const allAccepted = match.member_ids.every((id: string) => accepted.includes(id));

    if (allAccepted) {
      // Update match status
      await supabase
        .from('matches')
        .update({ status: 'mutual_accept', updated_at: new Date().toISOString() })
        .eq('id', matchId);

      // Post intro embed to channel
      const channelId = Deno.env.get('DISCORD_INTRO_CHANNEL_ID');
      if (channelId) {
        const { data: memberProfiles } = await supabase
          .from('user_profiles')
          .select('display_name, profile')
          .in('user_id', match.member_ids);

        const memberNames =
          memberProfiles?.map((p) => p.display_name).join(' × ') || 'Members';

        const embed = {
          title: `✅ Mutual Accept — ${memberNames} (${match.score})`,
          description: match.explanation || 'Match accepted by all parties!',
          color: 0x10b981,
          fields: [
            {
              name: 'Type',
              value: match.type === 'nba2k_squad5' ? 'Squad5' : 'Pair',
              inline: true,
            },
            {
              name: 'Overlap',
              value: `~${Math.round((match.scheduled_overlap_minutes || 0) / 60)}h/wk`,
              inline: true,
            },
          ],
          footer: {
            text: 'Start gaming together! • Help: streamersupport@planetcuhz.com',
          },
          timestamp: new Date().toISOString(),
        };

        const messagePayload: any = {
          embeds: [embed],
        };

        const roleToPing = Deno.env.get('DISCORD_ROLE_TO_PING');
        if (roleToPing) {
          messagePayload.content = `<@&${roleToPing}>`;
        }

        const messageRes = await fetch(
          `https://discord.com/api/v10/channels/${channelId}/messages`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(messagePayload),
          }
        );

        if (messageRes.ok) {
          const message = await messageRes.json();
          // Create thread
          await fetch(
            `https://discord.com/api/v10/channels/${channelId}/messages/${message.id}/threads`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: `${memberNames} (${match.score})`,
                auto_archive_duration: 1440,
              }),
            }
          );
        }
      }
    }

    return new Response(
      JSON.stringify({
        type: 4,
        data: {
          content:
            action === 'accept'
              ? allAccepted
                ? '✅ Match accepted by all! Check the intro thread.'
                : '✅ Accepted! Waiting for others.'
              : '✖️ Match declined.',
          flags: 64,
        },
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Handle slash commands
  if (body.type === 2 && body.data?.name) {
    const command = body.data.name;
    const discordUserId = body.member?.user?.id || body.user?.id;

    // Find user
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('user_id, profile')
      .filter('profile->global->discord_conn->>userId', 'eq', discordUserId);

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({
          type: 4,
          data: {
            content:
              '⚠️ Discord account not linked. Visit the Protocol Account page to connect.',
            flags: 64,
          },
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = profiles[0].user_id;

    if (command === 'my-matches') {
      const { data: matches } = await supabase
        .from('matches')
        .select('*')
        .contains('member_ids', [userId])
        .order('created_at', { ascending: false })
        .limit(5);

      if (!matches || matches.length === 0) {
        return new Response(
          JSON.stringify({
            type: 4,
            data: { content: 'No matches found.', flags: 64 },
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      }

      const lines = matches.map(
        (m) =>
          `• **${m.id.substring(0, 8)}** - Status: ${m.status} - Score: ${m.score}`
      );

      return new Response(
        JSON.stringify({
          type: 4,
          data: {
            content: `📋 Your Latest Matches:\n${lines.join('\n')}`,
            flags: 64,
          },
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (command === 'link') {
      const clientId = Deno.env.get('VITE_DISCORD_CLIENT_ID');
      const redirectUri =
        Deno.env.get('VITE_DISCORD_REDIRECT_URI') ||
        `${SUPABASE_URL}/functions/v1/discord-link`;
      const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify`;

      return new Response(
        JSON.stringify({
          type: 4,
          data: {
            content: `🔗 [Connect Your Discord Account](${oauthUrl})`,
            flags: 64,
          },
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response(
    JSON.stringify({ type: 4, data: { content: 'Unknown command', flags: 64 } }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
