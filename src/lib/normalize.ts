export const norm = {
  twitch: (s?: string|null) => !s ? null : s.trim().toLowerCase().replace(/^@/,''),
  discord: (s?: string|null) => !s ? null : s.trim().toLowerCase().replace(/^@/,''),
  psn: (s?: string|null) => !s ? null : s.trim(),
  xbox: (s?: string|null) => !s ? null : s.trim(),
  mode: (m: string) => m.trim().replace(/^proven ground$/i,'Proving Ground')
};

export function normalizeHandles(h: { psn?: string|null; xbox?: string|null; discord?: string|null; twitch?: string|null }) {
  return {
    psn: norm.psn(h.psn),
    xbox: norm.xbox(h.xbox),
    discord: norm.discord(h.discord),
    twitch: norm.twitch(h.twitch)
  };
}
