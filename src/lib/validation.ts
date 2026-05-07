export const hasUrlOrNewline = (s: string) => /https?:\/\/|\n|\r/.test(s);
export const required = (v?: string | null) => !!v && String(v).trim().length > 0;

export function validateHandles(h: { psn?: string|null; xbox?: string|null; discord?: string|null; twitch?: string|null }) {
  for (const key of Object.keys(h) as (keyof typeof h)[]) {
    const val = h[key];
    if (!val) continue;
    if (hasUrlOrNewline(val)) return `${key} cannot contain URLs or line breaks`;
  }
  return null;
}

export function reachabilityGuard(share: 'public'|'matches'|'none', email?: string|null, phone?: string|null) {
  if (share === 'none' && !required(email) && !required(phone)) {
    return 'When handle sharing is "private", you must provide email or phone so we can reach you.';
  }
  return null;
}
