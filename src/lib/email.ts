// Production-ready Email notification via SendGrid
import { supabase } from '@/integrations/supabase/client';

export type EmailSendArgs = {
  to: string;
  templateId: string;
  dynamicData: Record<string, any>;
  sandbox?: boolean;
};

export async function sendEmail(args: EmailSendArgs) {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: args.to,
        templateId: args.templateId,
        dynamicData: args.dynamicData,
        sandbox: args.sandbox ?? false,
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Send email error:', error);
    throw error;
  }
}
