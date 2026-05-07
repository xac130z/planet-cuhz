import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import MatchCard from './components/MatchCard';
import { useOnboardedOrRedirect } from '@/lib/onboardGuard';
import SupportContact from '@/components/SupportContact';
import DiscordConnect from '@/components/DiscordConnect';

export default function MatchesPage() {
  const ready = useOnboardedOrRedirect();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ready) return;
    (async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .contains('member_ids', [uid])
        .order('created_at', { ascending: false });
      if (!error) setRows(data || []);
      setLoading(false);
    })();
  }, [ready]);

  if (!ready) return null;

  return (
    <main className="max-w-5xl">
      {/* Discord Connection Banner */}
      <DiscordConnect />

      <section className="protocol-card" style={{ padding:16, marginBottom:16 }}>
        <h2 style={{ fontWeight:600, marginBottom:6 }}>Your Matches</h2>
        <p style={{ color:'#bdbdbd' }}>Accept to connect; mutual accepts trigger intros via Discord DM or webhook.</p>
      </section>

      {loading && <div className="protocol-skeleton" aria-busy="true" aria-live="polite" />}
      {!loading && rows.length === 0 && (
        <div className="protocol-card" style={{ padding: 20, textAlign: 'center', color: '#9aa0a6' }}>
          No matches yet. Check back soon or ask an admin to run the matcher.
        </div>
      )}
      <div className="matches-grid" aria-live="polite">
        {rows.map(r => <MatchCard key={r.id} row={r} onUpdate={() => {
          // Refresh matches after action
          (async () => {
            const { data: userData } = await supabase.auth.getUser();
            const uid = userData.user?.id;
            const { data } = await supabase
              .from('matches')
              .select('*')
              .contains('member_ids', [uid])
              .order('created_at', { ascending: false });
            setRows(data || []);
          })();
        }} />)}
      </div>

      <SupportContact />
    </main>
  );
}
