import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const DISCORD_CLIENT_ID = Deno.env.get('VITE_DISCORD_CLIENT_ID')!;
const DISCORD_CLIENT_SECRET = Deno.env.get('DISCORD_CLIENT_SECRET')!;
const DISCORD_REDIRECT_URI = Deno.env.get('VITE_DISCORD_REDIRECT_URI') || `${SUPABASE_URL}/functions/v1/discord-link`;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code) {
    return new Response('Missing authorization code', { status: 400 });
  }

  // Exchange code for access token
  const tokenParams = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    client_secret: DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: DISCORD_REDIRECT_URI,
  });

  const tokenRes = await fetch('https://discord.com/api/v10/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenParams.toString(),
  });

  if (!tokenRes.ok) {
    const error = await tokenRes.text();
    console.error('Token exchange failed:', error);
    return new Response('Failed to exchange code for token', { status: 500 });
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // Fetch Discord user
  const userRes = await fetch('https://discord.com/api/v10/users/@me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!userRes.ok) {
    return new Response('Failed to fetch Discord user', { status: 500 });
  }

  const discordUser = await userRes.json();

  // Get current user from JWT (if provided)
  const authHeader = req.headers.get('Authorization');
  let userId = null;

  if (authHeader) {
    const jwt = authHeader.split('Bearer ')[1];
    const { data: user } = await supabase.auth.getUser(jwt);
    userId = user?.user?.id;
  }

  // If no JWT, try to find user by Discord ID (if already linked)
  if (!userId) {
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('user_id')
      .filter('profile->global->discord_conn->>userId', 'eq', discordUser.id)
      .maybeSingle();

    userId = profiles?.user_id;
  }

  if (!userId) {
    return new Response(
      'Unable to determine user. Please log in first.',
      { status: 401 }
    );
  }

  // Update user profile with Discord connection
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('profile')
    .eq('user_id', userId)
    .single();

  const updatedProfile = {
    ...profile?.profile,
    global: {
      ...profile?.profile?.global,
      discord_conn: {
        connected: true,
        userId: discordUser.id,
        username: discordUser.username,
        preferDiscord: true,
      },
    },
  };

  await supabase
    .from('user_profiles')
    .update({ profile: updatedProfile })
    .eq('user_id', userId);

  // Redirect back to account page
  const redirectUrl = `${url.origin}/protocol/account?discord_linked=true`;
  return new Response(null, {
    status: 302,
    headers: { Location: redirectUrl },
  });
});
