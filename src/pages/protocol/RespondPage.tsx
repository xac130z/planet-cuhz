import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function RespondPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    handleResponse();
  }, []);

  const handleResponse = async () => {
    const matchId = searchParams.get('matchId') || searchParams.get('m');
    const action = searchParams.get('action') || searchParams.get('a');

    if (!matchId || !action) {
      setResult({
        success: false,
        message: 'Invalid link: missing matchId or action parameters',
      });
      setProcessing(false);
      return;
    }

    if (!['accept', 'decline'].includes(action)) {
      setResult({
        success: false,
        message: 'Invalid action: must be "accept" or "decline"',
      });
      setProcessing(false);
      return;
    }

    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast.error('Please sign in to respond to matches');
        navigate('/protocol/auth');
        return;
      }

      // Verify user is a member of this match
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .select('member_ids, status')
        .eq('id', matchId)
        .single();

      if (matchError || !match) {
        setResult({
          success: false,
          message: 'Match not found or you do not have access',
        });
        setProcessing(false);
        return;
      }

      if (!match.member_ids.includes(user.id)) {
        setResult({
          success: false,
          message: 'You are not a member of this match',
        });
        setProcessing(false);
        return;
      }

      // Record response
      const { error: responseError } = await supabase
        .from('match_responses')
        .upsert(
          {
            match_id: matchId,
            user_id: user.id,
            action,
          },
          { onConflict: 'match_id,user_id' }
        );

      if (responseError) throw responseError;

      // Check if all members have accepted
      const { data: responses } = await supabase
        .from('match_responses')
        .select('user_id, action')
        .eq('match_id', matchId);

      const allAccepted = match.member_ids.every((id: string) =>
        responses?.some(r => r.user_id === id && r.action === 'accept')
      );

      if (allAccepted && action === 'accept') {
        // Trigger notification for mutual accept
        await supabase.functions.invoke('notify', {
          body: { matchId },
        });

        setResult({
          success: true,
          message: '🎉 Match accepted! All members have accepted. Check your Discord/Email for intro details.',
        });
        toast.success('Match accepted! Mutual acceptance achieved.');
      } else if (action === 'accept') {
        setResult({
          success: true,
          message: `✓ You accepted this match. Waiting for ${match.member_ids.length - (responses?.filter(r => r.action === 'accept').length || 0)} other member(s) to accept.`,
        });
        toast.success('Match accepted!');
      } else {
        setResult({
          success: true,
          message: '✗ You declined this match. It will be removed from your list.',
        });
        toast.info('Match declined');
      }

      setProcessing(false);

      // Redirect to matches page after 3 seconds
      setTimeout(() => {
        navigate('/protocol/matches');
      }, 3000);
    } catch (error) {
      console.error('Response error:', error);
      setResult({
        success: false,
        message: 'Failed to record your response. Please try again from the Matches page.',
      });
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#000' }}>
      <div className="max-w-md w-full protocol-card" style={{ padding: 32 }}>
        <div className="text-center">
          {processing ? (
            <>
              <div className="protocol-skeleton mb-4" aria-busy="true" style={{ height: 80 }} />
              <p className="text-neutral-400">Processing your response...</p>
            </>
          ) : result ? (
            <>
              <div
                className="text-6xl mb-4"
                role="img"
                aria-label={result.success ? 'Success' : 'Error'}
              >
                {result.success ? '✓' : '✗'}
              </div>
              <h1
                className="text-2xl font-bold mb-4"
                style={{ color: result.success ? '#10b981' : '#ef4444' }}
              >
                {result.success ? 'Response Recorded' : 'Error'}
              </h1>
              <p className="text-neutral-300 mb-6">{result.message}</p>
              <button
                className="protocol-btn"
                onClick={() => navigate('/protocol/matches')}
              >
                Go to Matches
              </button>
            </>
          ) : null}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Need help?{' '}
          <a
            href="mailto:streamersupport@planetcuhz.com"
            className="protocol-link"
          >
            streamersupport@planetcuhz.com
          </a>
        </p>
      </div>
    </div>
  );
}
