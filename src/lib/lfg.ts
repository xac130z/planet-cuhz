import { supabase } from '@/integrations/supabase/client';
import { checkProfanity, isUserBanned } from './admin';

export type ListingData = {
  title: string;
  needed_positions: string[];
  modes: string[];
  platform: string;
  allows_crossplay: boolean;
  region: string;
  availability: string;
  notes?: string;
  boost?: boolean;
};

export type ApplicationData = {
  listing_id: string;
  message?: string;
};

export async function createListing(data: ListingData) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  // Check if user is banned
  const banned = await isUserBanned(userData.user.id);
  if (banned) throw new Error('You are banned from creating listings');

  // Check for profanity
  const profanityMatch = checkProfanity(data.title + ' ' + (data.notes || ''));
  if (profanityMatch) {
    throw new Error('Your listing contains inappropriate content and has been flagged for review');
  }

  const boost_expires_at = data.boost 
    ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    : null;

  const { data: listing, error } = await supabase
    .from('lfg_listings')
    .insert({
      user_id: userData.user.id,
      role: 'N/A', // Legacy field, not used in Phase 3
      title: data.title.trim(),
      needed_positions: data.needed_positions,
      modes: data.modes,
      platform: data.platform,
      allows_crossplay: data.allows_crossplay,
      region: data.region,
      availability: data.availability,
      notes: data.notes?.trim() || null,
      boost_expires_at,
      status: 'active'
    })
    .select()
    .single();

  if (error) throw error;
  return listing;
}

export async function fetchListings(filters?: {
  platform?: string;
  region?: string;
  modes?: string[];
  positions?: string[];
  user_id?: string;
}) {
  let query = supabase
    .from('lfg_listings')
    .select('*, user_profiles!inner(display_name)')
    .eq('status', 'active');

  if (filters?.platform) {
    query = query.or(`platform.eq.${filters.platform},allows_crossplay.eq.true`);
  }
  if (filters?.region) {
    query = query.eq('region', filters.region);
  }
  if (filters?.modes && filters.modes.length > 0) {
    query = query.overlaps('modes', filters.modes);
  }
  if (filters?.positions && filters.positions.length > 0) {
    query = query.overlaps('needed_positions', filters.positions);
  }
  if (filters?.user_id) {
    query = query.eq('user_id', filters.user_id);
  }

  const { data, error } = await query.order('boost_expires_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function applyToListing(data: ApplicationData) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  // Check if user is banned
  const banned = await isUserBanned(userData.user.id);
  if (banned) throw new Error('You are banned from applying to listings');

  const { data: application, error } = await supabase
    .from('lfg_applications')
    .insert({
      listing_id: data.listing_id,
      applicant_id: userData.user.id,
      message: data.message?.trim() || null,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return application;
}

export async function acceptApplicant(applicationId: string) {
  const { data, error } = await supabase
    .from('lfg_applications')
    .update({ status: 'accepted', updated_at: new Date().toISOString() })
    .eq('id', applicationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function closeListing(listingId: string) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('lfg_listings')
    .update({ status: 'closed' })
    .eq('id', listingId)
    .eq('user_id', userData.user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchApplicationsForListing(listingId: string) {
  const { data, error } = await supabase
    .from('lfg_applications')
    .select('*, user_profiles!inner(display_name)')
    .eq('listing_id', listingId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
