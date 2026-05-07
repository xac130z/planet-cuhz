import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export function useOnboardedOrRedirect() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/protocol/auth', { replace: true });
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .single();

      if (!profile || !profile.onboarding_completed) {
        navigate('/protocol/onboarding', { replace: true });
        return;
      }

      setReady(true);
    })();
  }, [navigate]);

  return ready;
}
