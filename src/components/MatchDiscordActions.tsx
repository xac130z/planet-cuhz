import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isUserAdmin } from '@/lib/admin';

interface Props {
  matchId: string;
}

export default function MatchDiscordActions({ matchId }: Props) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [sending, setSending] = useState(false);

  // Check admin status
  useState(() => {
    (async () => {
      const admin = await isUserAdmin();
      setIsAdmin(admin);
    })();
  });

  if (!isAdmin) return null;

  const handleResendDM = async () => {
    try {
      setSending(true);
      const { error } = await supabase.functions.invoke('notify', {
        body: { matchId, force: true },
      });

      if (error) throw error;
      alert('Discord DM sent successfully');
    } catch (err) {
      console.error('Resend DM error:', err);
      alert('Failed to send Discord DM. Check logs.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ marginTop: 8 }}>
      <button
        className="protocol-btn-sm"
        onClick={handleResendDM}
        disabled={sending}
        title="Admin: Force send Discord DM for this match"
      >
        {sending ? 'Sending...' : '📬 Resend Discord DM'}
      </button>
    </div>
  );
}
