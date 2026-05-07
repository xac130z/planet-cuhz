import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { isUserAdmin, fetchModerationQueue, fetchAdminStats } from '@/lib/admin';
import SupportContact from '@/components/SupportContact';
import ModerationQueue from '@/components/admin/ModerationQueue';
import AdminActions from '@/components/admin/AdminActions';
import AdminHealth from '@/components/admin/AdminHealth';
import { toast } from 'sonner';

type Tab = 'queue' | 'listings' | 'matches' | 'payments' | 'actions' | 'audit' | 'health';

export default function AdminPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>('queue');
  const [flags, setFlags] = useState<any[]>([]);
  const [stats, setStats] = useState({ flags: 0, bans: 0, listings: 0, matches: 0 });
  const [listings, setListings] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, tab]);

  const checkAdminAccess = async () => {
    const admin = await isUserAdmin();
    if (!admin) {
      toast.error('Access denied: Admin privileges required');
      navigate('/protocol/matches');
      return;
    }
    setIsAdmin(true);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const statsData = await fetchAdminStats();
      setStats(statsData);

      if (tab === 'queue') {
        const flagsData = await fetchModerationQueue();
        setFlags(flagsData);
      } else if (tab === 'listings') {
        const { data } = await supabase
          .from('lfg_listings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        setListings(data || []);
      } else if (tab === 'matches') {
        const { data } = await supabase
          .from('matches')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        setMatches(data || []);
      } else if (tab === 'payments') {
        const { data } = await supabase
          .from('payments_audit')
          .select('*')
          .order('processed_at', { ascending: false })
          .limit(50);
        setPayments(data || []);
      } else if (tab === 'audit') {
        const { data } = await supabase
          .from('admin_audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);
        setAuditLogs(data || []);
      }
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin === null || isAdmin === false) {
    return null;
  }

  return (
    <main>
      <section className="protocol-card mb-6" style={{ padding: 20 }}>
        <h1 className="text-2xl font-bold mb-2">🛡️ Admin Console</h1>
        <p className="text-muted-foreground mb-4">
          NBA 2K Protocol — Moderation & System Management
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="p-3 bg-black/30 rounded border border-neutral-700">
            <div className="text-2xl font-bold">{stats.flags}</div>
            <div className="text-sm text-muted-foreground">Open Flags</div>
          </div>
          <div className="p-3 bg-black/30 rounded border border-neutral-700">
            <div className="text-2xl font-bold">{stats.bans}</div>
            <div className="text-sm text-muted-foreground">Active Bans</div>
          </div>
          <div className="p-3 bg-black/30 rounded border border-neutral-700">
            <div className="text-2xl font-bold">{stats.listings}</div>
            <div className="text-sm text-muted-foreground">Total Listings</div>
          </div>
          <div className="p-3 bg-black/30 rounded border border-neutral-700">
            <div className="text-2xl font-bold">{stats.matches}</div>
            <div className="text-sm text-muted-foreground">Total Matches</div>
          </div>
        </div>
      </section>

      <div className="lfg-tabs mb-6">
        <button
          className={`lfg-tab ${tab === 'queue' ? 'active' : ''}`}
          onClick={() => setTab('queue')}
        >
          Queue {stats.flags > 0 && <span className="badge flagged ml-2">{stats.flags}</span>}
        </button>
        <button
          className={`lfg-tab ${tab === 'listings' ? 'active' : ''}`}
          onClick={() => setTab('listings')}
        >
          Listings
        </button>
        <button
          className={`lfg-tab ${tab === 'matches' ? 'active' : ''}`}
          onClick={() => setTab('matches')}
        >
          Matches
        </button>
        <button
          className={`lfg-tab ${tab === 'payments' ? 'active' : ''}`}
          onClick={() => setTab('payments')}
        >
          Payments
        </button>
        <button
          className={`lfg-tab ${tab === 'actions' ? 'active' : ''}`}
          onClick={() => setTab('actions')}
        >
          Actions
        </button>
        <button
          className={`lfg-tab ${tab === 'audit' ? 'active' : ''}`}
          onClick={() => setTab('audit')}
        >
          Audit
        </button>
        <button
          className={`lfg-tab ${tab === 'health' ? 'active' : ''}`}
          onClick={() => setTab('health')}
        >
          Health
        </button>
      </div>

      {loading ? (
        <div className="protocol-card" style={{ padding: 20 }}>
          <div className="protocol-skeleton" aria-busy="true" />
        </div>
      ) : (
        <>
          {tab === 'queue' && <ModerationQueue flags={flags} onRefresh={loadData} />}
          
          {tab === 'listings' && (
            <div className="protocol-card" style={{ padding: 20 }}>
              <h2 className="text-xl font-semibold mb-4">Recent Listings</h2>
              <div className="space-y-2">
                {listings.map((listing) => (
                  <div key={listing.id} className="p-3 bg-black/30 rounded border border-neutral-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">{listing.title}</span>
                        <span className={`badge ml-2 ${listing.status}`}>{listing.status}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(listing.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'matches' && (
            <div className="protocol-card" style={{ padding: 20 }}>
              <h2 className="text-xl font-semibold mb-4">Recent Matches</h2>
              <div className="space-y-2">
                {matches.map((match) => (
                  <div key={match.id} className="p-3 bg-black/30 rounded border border-neutral-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">{match.type}</span>
                        <span className="ml-2 text-sm">Score: {match.score}</span>
                        <span className={`badge ml-2 ${match.status}`}>{match.status}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(match.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'payments' && (
            <div className="protocol-card" style={{ padding: 20 }}>
              <h2 className="text-xl font-semibold mb-4">Payment Events</h2>
              <div className="space-y-2">
                {payments.map((payment) => (
                  <div key={payment.event_id} className="p-3 bg-black/30 rounded border border-neutral-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">{payment.event_type}</span>
                        {payment.price_id && (
                          <span className="ml-2 text-sm text-muted-foreground">{payment.price_id}</span>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(payment.processed_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'actions' && <AdminActions />}

          {tab === 'audit' && (
            <div className="protocol-card" style={{ padding: 20 }}>
              <h2 className="text-xl font-semibold mb-4">Audit Log</h2>
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-black/30 rounded border border-neutral-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">{log.action}</span>
                        {log.target_type && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            {log.target_type}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'health' && <AdminHealth />}
        </>
      )}

      <SupportContact />
    </main>
  );
}
