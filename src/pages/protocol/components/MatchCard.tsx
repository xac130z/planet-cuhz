import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { notifyMatch } from '@/lib/notify';

export default function MatchCard({ row, onUpdate }: { row: any; onUpdate: () => void }) {
  const [processing, setProcessing] = useState(false);

  const accept = async () => {
    setProcessing(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      const { error } = await supabase
        .from('match_responses')
        .upsert(
          { match_id: row.id, user_id: uid, action: 'accept' },
          { onConflict: 'match_id,user_id' }
        );
      if (error) throw error;
      
      // Check if mutual accept and trigger notification
      const { data: responses } = await supabase
        .from('match_responses')
        .select('user_id, action')
        .eq('match_id', row.id);
      
      const accepted = (responses || [])
        .filter((r: any) => r.action === 'accept')
        .map((r: any) => r.user_id);
      
      const allAccepted = row.member_ids.every((id: string) => accepted.includes(id));
      
      if (allAccepted) {
        // Trigger mutual accept notification
        try {
          await notifyMatch(row.id);
          toast.success('Match accepted! Mutual acceptance notification sent.');
        } catch (notifyError) {
          console.error('Notification error:', notifyError);
          toast.success('Match accepted!');
        }
      } else {
        toast.success('Match accepted!');
      }
      
      onUpdate();
    } catch (e) {
      console.error(e);
      toast.error('Failed to accept match');
    } finally {
      setProcessing(false);
    }
  };

  const decline = async () => {
    setProcessing(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      const { error } = await supabase
        .from('match_responses')
        .upsert(
          { match_id: row.id, user_id: uid, action: 'decline' },
          { onConflict: 'match_id,user_id' }
        );
      if (error) throw error;
      toast.success('Match declined');
      onUpdate();
    } catch (e) {
      console.error(e);
      toast.error('Failed to decline match');
    } finally {
      setProcessing(false);
    }
  };

  const roster = (row.position_coverage && Object.keys(row.position_coverage).length)
    ? Object.entries(row.position_coverage).map(([k,v])=>`${k}:${v}`).join(' · ')
    : '—';

  const hours = Math.round((row.scheduled_overlap_minutes || 0) / 60);
  const typeLabel = row.type === 'nba2k_squad5' ? 'Squad5' : 'Pair';

  return (
    <article className="match-card">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 8 }}>
        <h4 style={{ fontWeight:600, fontSize: '1.1rem' }}>Score {row.score}/100</h4>
        <span className={`badge ${row.score >= 70 ? 'good' : ''}`}>{typeLabel}</span>
      </div>
      <div style={{ color:'#bdbdbd', fontSize: '0.9rem', marginBottom: 10 }}>
        Overlap ≈ {hours}h/wk · Coverage {roster}
      </div>
      <ul className="why-list" style={{ marginBottom: 12 }}>
        {(row.explanation || '').split('\n').filter((b: string) => b.trim()).map((b: string, i: number) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
      <div className="protocol-actions">
        <button 
          className="protocol-btn" 
          onClick={accept} 
          disabled={processing}
          aria-label="Accept match"
        >
          {processing ? 'Processing…' : 'Accept'}
        </button>
        <button 
          className="protocol-btn secondary" 
          onClick={decline} 
          disabled={processing}
          aria-label="Decline match"
        >
          {processing ? 'Processing…' : 'Decline'}
        </button>
      </div>
    </article>
  );
}
