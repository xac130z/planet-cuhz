import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const form = await req.formData();
    
    const messageSid = form.get('MessageSid')?.toString();
    const status = form.get('MessageStatus')?.toString(); // queued/sent/delivered/failed/undelivered
    const to = form.get('To')?.toString();
    const errorCode = form.get('ErrorCode')?.toString();
    const errorMessage = form.get('ErrorMessage')?.toString();

    console.log('Twilio status update:', { messageSid, status, to, errorCode, errorMessage });

    // Try to update notification record by matching messageSid in payload
    // This requires storing messageSid when creating the notification
    if (messageSid) {
      const { error } = await supabase
        .from('notifications')
        .update({
          status: mapTwilioStatus(status || ''),
          error: errorMessage || null,
          last_attempt_at: new Date().toISOString(),
        })
        .contains('payload', { messageSid });

      if (error) {
        console.error('Error updating notification:', error);
      }
    }

    return new Response('ok', { headers: corsHeaders });
  } catch (e) {
    console.error('SMS status webhook error:', e);
    return new Response('error', { status: 500, headers: corsHeaders });
  }
});

function mapTwilioStatus(twilioStatus: string): string {
  switch (twilioStatus) {
    case 'queued':
    case 'sending':
      return 'queued';
    case 'sent':
      return 'sent';
    case 'delivered':
      return 'delivered';
    case 'failed':
    case 'undelivered':
      return 'failed';
    default:
      return 'sent';
  }
}
