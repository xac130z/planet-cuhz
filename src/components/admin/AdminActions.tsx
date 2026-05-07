import { useState } from 'react';
import { adminAction } from '@/lib/admin';
import { toast } from 'sonner';

export default function AdminActions() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: string, label: string) => {
    try {
      setLoading(action);
      const result = await adminAction(action, {});
      toast.success(result.message || label + ' completed');
    } catch (error) {
      toast.error(`${label} failed: ${error}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="protocol-card" style={{ padding: 20 }}>
      <h2 className="text-xl font-semibold mb-4">System Actions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Matching</h3>
          <div className="space-y-2">
            <button
              className="protocol-btn w-full"
              onClick={() => handleAction('run_matcher', 'Run matcher')}
              disabled={loading === 'run_matcher'}
            >
              {loading === 'run_matcher' ? 'Running...' : '▶ Run Matcher Now'}
            </button>
            <button
              className="protocol-btn w-full"
              onClick={() => handleAction('rebuild_matches', 'Rebuild matches')}
              disabled={loading === 'rebuild_matches'}
            >
              {loading === 'rebuild_matches' ? 'Rebuilding...' : '🔄 Rebuild Matches'}
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Testing</h3>
          <div className="space-y-2">
            <button
              className="protocol-btn w-full"
              onClick={() => handleAction('seed_data', 'Seed test data')}
              disabled={loading === 'seed_data'}
            >
              {loading === 'seed_data' ? 'Seeding...' : '🌱 Seed Test Data'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Notifications</h3>
        <div className="space-y-2">
          <button
            className="protocol-btn w-full secondary"
            onClick={() => handleAction('test_email', 'Test email')}
            disabled={loading === 'test_email'}
          >
            {loading === 'test_email' ? 'Sending...' : '📧 Test Email (SendGrid)'}
          </button>
          <button
            className="protocol-btn w-full secondary"
            onClick={() => handleAction('test_sms', 'Test SMS')}
            disabled={loading === 'test_sms'}
          >
            {loading === 'test_sms' ? 'Sending...' : '📱 Test SMS (Twilio)'}
          </button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-black/30 rounded border border-neutral-700">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> Run Matcher processes all onboarded profiles and creates new matches.
          Rebuild Matches recomputes scores for recent matches. Seed Data creates 6 test profiles.
          Test notifications send to your profile email/phone if configured.
        </p>
      </div>
    </div>
  );
}
