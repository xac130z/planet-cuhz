/**
 * Discord utilities for bot interactions, embeds, OAuth, etc.
 */

// Build OAuth URL for connecting Discord account
export function buildDiscordOAuthURL(): string {
  const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_DISCORD_REDIRECT_URI || `${window.location.origin}/api/discord-link`;
  
  if (!clientId) {
    console.warn('VITE_DISCORD_CLIENT_ID not set');
    return '#';
  }

  const state = Math.random().toString(36).substring(7);
  sessionStorage.setItem('discord_oauth_state', state);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'identify',
    state,
  });

  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

// Build embed for new match
export function buildNewMatchEmbed(match: any, profileNames: Record<string, string>) {
  const memberNames = match.member_ids.map((id: string) => profileNames[id] || 'Unknown').join(' × ');
  const typeLabel = match.type === 'nba2k_squad5' ? 'Squad5' : 'Pair';
  const overlap = Math.round((match.scheduled_overlap_minutes || 0) / 60);
  
  const roster = match.position_coverage && Object.keys(match.position_coverage).length > 0
    ? Object.entries(match.position_coverage)
        .map(([k, v]) => `${k}:${v}`)
        .join(' · ')
    : '—';

  return {
    title: `🏀 New Match — Score ${match.score}/100`,
    description: match.explanation || 'You have a new match!',
    color: 0x1F5EFF, // Protocol blue
    fields: [
      { name: 'Type', value: typeLabel, inline: true },
      { name: 'Overlap', value: `~${overlap}h/wk`, inline: true },
      { name: 'Coverage', value: roster, inline: true },
    ],
    footer: {
      text: 'Accept or decline using the buttons below • Help: streamersupport@planetcuhz.com',
    },
    timestamp: new Date().toISOString(),
  };
}

// Build embed for mutual accept intro
export function buildMutualAcceptEmbed(match: any, profiles: any[]) {
  const memberNames = profiles.map(p => p.display_name).join(' × ');
  const typeLabel = match.type === 'nba2k_squad5' ? 'Squad5' : 'Pair';
  const overlap = Math.round((match.scheduled_overlap_minutes || 0) / 60);

  // Privacy: only show handles if share_handles is public or matches
  const handles = profiles
    .filter(p => {
      const shareHandles = p.profile?.global?.share_handles || 'matches';
      return shareHandles === 'public' || shareHandles === 'matches';
    })
    .map(p => {
      const discord = p.profile?.global?.handles?.discord || 'N/A';
      const twitch = p.profile?.global?.handles?.twitch || 'N/A';
      return `**${p.display_name}**: Discord: ${discord}, Twitch: ${twitch}`;
    })
    .join('\n') || 'Handles hidden per privacy settings';

  return {
    title: `✅ Mutual Accept — ${memberNames} (${match.score})`,
    description: match.explanation || 'Match accepted by all parties!',
    color: 0x10b981, // Green
    fields: [
      { name: 'Type', value: typeLabel, inline: true },
      { name: 'Overlap', value: `~${overlap}h/wk`, inline: true },
      { name: 'Handles', value: handles, inline: false },
    ],
    footer: {
      text: 'Start gaming together! • Help: streamersupport@planetcuhz.com',
    },
    timestamp: new Date().toISOString(),
  };
}

// Custom IDs for buttons
export function getAcceptButtonId(matchId: string): string {
  return `accept:${matchId}`;
}

export function getDeclineButtonId(matchId: string): string {
  return `decline:${matchId}`;
}

// Parse button custom_id
export function parseButtonId(customId: string): { action: 'accept' | 'decline'; matchId: string } | null {
  const parts = customId.split(':');
  if (parts.length !== 2) return null;
  const [action, matchId] = parts;
  if (action !== 'accept' && action !== 'decline') return null;
  return { action, matchId };
}

// Get Discord connection status label
export function getConnectionStatusLabel(connected: boolean): string {
  return connected ? '✅ Discord Connected' : '⚠️ Discord Not Connected';
}
