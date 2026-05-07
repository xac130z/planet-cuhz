import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useProfileCount() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { count: total, error } = await supabase
          .from('protocol_public_profiles')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        setCount(total || 0);
      } catch (err) {
        console.error('Failed to fetch profile count:', err);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, []);

  return { count, loading };
}
