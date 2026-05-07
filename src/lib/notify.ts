import { supabase } from '@/integrations/supabase/client';

export async function notifyMatch(matchId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('notify', {
      body: { matchId }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Notify match error:', error);
    throw error;
  }
}
