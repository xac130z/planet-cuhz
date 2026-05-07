import { useState } from 'react';
import { createListing } from '@/lib/lfg';
import { useToast } from '@/hooks/use-toast';
import AvailabilityGrid from './AvailabilityGrid';

const positions = ['PG', 'SG', 'SF', 'PF', 'C'];
const modes = ['Pro-Am 5v5', 'Rec', 'Proving Ground', 'Park/City'];
const platforms = ['PS5', 'Xbox Series', 'PC', 'Switch', 'Other'];
const regions = ['NA-East', 'NA-West', 'EU', 'Asia', 'SA', 'Oceania', 'Other'];

export default function LfgComposer({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  
  const [title, setTitle] = useState('');
  const [neededPositions, setNeededPositions] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [platform, setPlatform] = useState('PS5');
  const [allowsCrossplay, setAllowsCrossplay] = useState(true);
  const [region, setRegion] = useState('NA-East');
  const [availability, setAvailability] = useState<{ day: string; start: string; end: string }[]>([]);
  const [notes, setNotes] = useState('');
  const [boost, setBoost] = useState(false);

  const togglePosition = (pos: string) => {
    setNeededPositions(prev => 
      prev.includes(pos) ? prev.filter(p => p !== pos) : [...prev, pos]
    );
  };

  const toggleMode = (mode: string) => {
    setSelectedModes(prev => 
      prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({ title: 'Title required', variant: 'destructive' });
      return;
    }
    if (neededPositions.length === 0) {
      toast({ title: 'Select at least one position', variant: 'destructive' });
      return;
    }
    if (selectedModes.length === 0) {
      toast({ title: 'Select at least one game mode', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      await createListing({
        title,
        needed_positions: neededPositions,
        modes: selectedModes,
        platform,
        allows_crossplay: allowsCrossplay,
        region,
        availability: JSON.stringify(availability),
        notes,
        boost
      });
      toast({ title: 'Listing created successfully!' });
      onSuccess();
    } catch (error) {
      console.error('Failed to create listing:', error);
      toast({ title: 'Failed to create listing', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="protocol-form">
      <div className="protocol-field">
        <label className="protocol-label" htmlFor="title">Title</label>
        <input 
          id="title"
          className="protocol-input" 
          value={title} 
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g., Looking for PG + C for Pro-Am"
          maxLength={100}
        />
      </div>

      <div className="protocol-field">
        <label className="protocol-label">Needed Positions</label>
        <div className="flex flex-wrap gap-2">
          {positions.map(pos => (
            <label key={pos} className="chip">
              <input 
                type="checkbox" 
                checked={neededPositions.includes(pos)} 
                onChange={() => togglePosition(pos)}
                className="mr-2"
              />
              {pos}
            </label>
          ))}
        </div>
      </div>

      <div className="protocol-field">
        <label className="protocol-label">Game Modes</label>
        <div className="flex flex-wrap gap-2">
          {modes.map(mode => (
            <label key={mode} className="chip">
              <input 
                type="checkbox" 
                checked={selectedModes.includes(mode)} 
                onChange={() => toggleMode(mode)}
                className="mr-2"
              />
              {mode}
            </label>
          ))}
        </div>
      </div>

      <div className="protocol-row">
        <div className="protocol-field">
          <label className="protocol-label" htmlFor="platform">Platform</label>
          <select 
            id="platform"
            className="protocol-select" 
            value={platform} 
            onChange={e => setPlatform(e.target.value)}
          >
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="protocol-field">
          <label className="protocol-label" htmlFor="crossplay">Allow Crossplay</label>
          <select 
            id="crossplay"
            className="protocol-select" 
            value={allowsCrossplay ? 'yes' : 'no'} 
            onChange={e => setAllowsCrossplay(e.target.value === 'yes')}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

      <div className="protocol-field">
        <label className="protocol-label" htmlFor="region">Region</label>
        <select 
          id="region"
          className="protocol-select" 
          value={region} 
          onChange={e => setRegion(e.target.value)}
        >
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="protocol-field">
        <label className="protocol-label">Availability</label>
        <AvailabilityGrid value={availability} onChange={setAvailability} />
      </div>

      <div className="protocol-field">
        <label className="protocol-label" htmlFor="notes">Notes (optional)</label>
        <textarea 
          id="notes"
          className="protocol-input min-h-[80px]" 
          value={notes} 
          onChange={e => setNotes(e.target.value)}
          placeholder="Any additional details..."
          maxLength={500}
        />
      </div>

      <div className="protocol-field">
        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={boost} 
            onChange={e => setBoost(e.target.checked)}
          />
          <span className="protocol-label mb-0">Featured Boost (7 days)</span>
        </label>
        <div className="protocol-help">Your listing will appear at the top</div>
      </div>

      <div className="protocol-actions">
        <button 
          type="submit" 
          className="protocol-btn" 
          disabled={submitting}
        >
          {submitting ? 'Creating...' : 'Create Listing'}
        </button>
      </div>
    </form>
  );
}
