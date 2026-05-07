import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Props {
  matchId: string;
  userEmail?: string;
  userPhone?: string;
}

export default function MatchActions({ matchId, userEmail, userPhone }: Props) {
  const [sending, setSending] = useState<string | null>(null);

  const handleResend = async (channel: 'email' | 'sms') => {
    try {
      setSending(channel);
      
      const { error } = await supabase.functions.invoke('notify', {
        body: { matchId, force: true, channel },
      });

      if (error) throw error;
      toast.success(`${channel.toUpperCase()} notification resent`);
    } catch (err) {
      console.error(`Resend ${channel} error:`, err);
      toast.error(`Failed to resend ${channel.toUpperCase()}`);
    } finally {
      setSending(null);
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      {userEmail && (
        <button
          className="protocol-btn-sm secondary"
          onClick={() => handleResend('email')}
          disabled={sending === 'email'}
          title="Resend email notification"
        >
          {sending === 'email' ? 'Sending...' : '📧 Resend Email'}
        </button>
      )}
      
      {userPhone && (
        <button
          className="protocol-btn-sm secondary"
          onClick={() => handleResend('sms')}
          disabled={sending === 'sms'}
          title="Resend SMS notification"
        >
          {sending === 'sms' ? 'Sending...' : '📱 Resend SMS'}
        </button>
      )}
    </div>
  );
}
