import { supabase } from '@/integrations/supabase/client';

// Profanity/ban word list
const BAN_WORDS = [
  'toxicword',
  'slur',
  'offensive',
  'spam123',
  // Add more as needed
];

export function checkProfanity(text: string): string | null {
  const lower = text.toLowerCase();
  for (const word of BAN_WORDS) {
    if (lower.includes(word.toLowerCase())) {
      return word;
    }
  }
  return null;
}

export async function isUserAdmin(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: roles } = await supabase
      .from('admin_roles')
      .select('role')
      .eq('user_id', user.id);

    return !!roles && roles.length > 0;
  } catch {
    return false;
  }
}

export async function isUserBanned(userId: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('ban_list')
      .select('id')
      .eq('user_id', userId)
      .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
      .single();

    return !!data;
  } catch {
    return false;
  }
}

export async function reportListing(listingId: string, reason: string, details?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from('content_flags').insert({
    listing_id: listingId,
    reporter_id: user.id,
    reason,
    details
  });

  if (error) throw error;
  return { ok: true };
}

export async function adminAction(action: string, params: any) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL || 'https://wjebryxdefcgsxsqomac.supabase.co'}/functions/v1/admin-actions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ action, ...params })
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return await res.json();
}

export async function fetchModerationQueue() {
  const { data, error } = await supabase
    .from('content_flags')
    .select(`
      *,
      listing:lfg_listings(*),
      reporter:reporter_id(id)
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchAdminStats() {
  const [flags, bans, listings, matches] = await Promise.all([
    supabase.from('content_flags').select('id', { count: 'exact', head: true }),
    supabase.from('ban_list').select('id', { count: 'exact', head: true }),
    supabase.from('lfg_listings').select('id', { count: 'exact', head: true }),
    supabase.from('matches').select('id', { count: 'exact', head: true })
  ]);

  return {
    flags: flags.count || 0,
    bans: bans.count || 0,
    listings: listings.count || 0,
    matches: matches.count || 0
  };
}
