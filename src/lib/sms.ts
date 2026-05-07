// Production-ready SMS notification via Twilio
import { supabase } from '@/integrations/supabase/client';

export async function sendSMS(to: string, body: string) {
  try {
    const { data, error } = await supabase.functions.invoke('send-sms', {
      body: { to, body },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Send SMS error:', error);
    throw error;
  }
}
