import { useState } from 'react';
import { useOnboardedOrRedirect } from '@/lib/onboardGuard';
import LfgSearch from './components/LfgSearch';
import LfgComposer from './components/LfgComposer';
import SupportContact from '@/components/SupportContact';

export default function LfgPage() {
  const ready = useOnboardedOrRedirect();
  const [tab, setTab] = useState<'browse' | 'create'>('browse');

  if (!ready) return null;

  return (
    <main>
      <section className="protocol-card mb-6" style={{ padding: 16 }}>
        <h2 style={{ fontWeight: 600, marginBottom: 6 }}>LFG — Looking for Group</h2>
        <p style={{ color: '#bdbdbd' }}>
          Find teammates or create a listing for your squad
        </p>
      </section>

      <div className="lfg-tabs mb-6">
        <button
          className={`lfg-tab ${tab === 'browse' ? 'active' : ''}`}
          onClick={() => setTab('browse')}
          aria-selected={tab === 'browse'}
        >
          Browse
        </button>
        <button
          className={`lfg-tab ${tab === 'create' ? 'active' : ''}`}
          onClick={() => setTab('create')}
          aria-selected={tab === 'create'}
        >
          Create Listing
        </button>
      </div>

      {tab === 'browse' && <LfgSearch />}
      {tab === 'create' && (
        <section className="protocol-card" style={{ padding: 20 }}>
          <LfgComposer onSuccess={() => setTab('browse')} />
        </section>
      )}

      <SupportContact />
    </main>
  );
}
