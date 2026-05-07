import { useEffect, useState } from 'react';
import { fetchListings } from '@/lib/lfg';
import { supabase } from '@/integrations/supabase/client';
import LfgItem from './LfgItem';

const platforms = ['All', 'PS5', 'Xbox Series', 'PC', 'Switch', 'Other'];
const regions = ['All', 'NA-East', 'NA-West', 'EU', 'Asia', 'SA', 'Oceania', 'Other'];
const modes = ['Pro-Am 5v5', 'Rec', 'Proving Ground', 'Park/City'];
const positions = ['PG', 'SG', 'SF', 'PF', 'C'];

export default function LfgSearch() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [platformFilter, setPlatformFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [modesFilter, setModesFilter] = useState<string[]>([]);
  const [positionsFilter, setPositionsFilter] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      setCurrentUserId(userData.user?.id || null);
    })();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (platformFilter !== 'All') filters.platform = platformFilter;
      if (regionFilter !== 'All') filters.region = regionFilter;
      if (modesFilter.length > 0) filters.modes = modesFilter;
      if (positionsFilter.length > 0) filters.positions = positionsFilter;

      const data = await fetchListings(filters);
      setListings(data);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, [platformFilter, regionFilter, modesFilter, positionsFilter]);

  const toggleMode = (mode: string) => {
    setModesFilter(prev => 
      prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]
    );
  };

  const togglePosition = (pos: string) => {
    setPositionsFilter(prev => 
      prev.includes(pos) ? prev.filter(p => p !== pos) : [...prev, pos]
    );
  };

  return (
    <div>
      <div className="lfg-filters mb-6">
        <div className="protocol-row">
          <div className="protocol-field">
            <label className="protocol-label" htmlFor="platform-filter">Platform</label>
            <select 
              id="platform-filter"
              className="protocol-select" 
              value={platformFilter} 
              onChange={e => setPlatformFilter(e.target.value)}
            >
              {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="protocol-field">
            <label className="protocol-label" htmlFor="region-filter">Region</label>
            <select 
              id="region-filter"
              className="protocol-select" 
              value={regionFilter} 
              onChange={e => setRegionFilter(e.target.value)}
            >
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="protocol-field">
          <label className="protocol-label">Game Modes</label>
          <div className="flex flex-wrap gap-2">
            {modes.map(mode => (
              <label key={mode} className="chip">
                <input 
                  type="checkbox" 
                  checked={modesFilter.includes(mode)} 
                  onChange={() => toggleMode(mode)}
                  className="mr-2"
                />
                {mode}
              </label>
            ))}
          </div>
        </div>

        <div className="protocol-field">
          <label className="protocol-label">Needed Positions</label>
          <div className="flex flex-wrap gap-2">
            {positions.map(pos => (
              <label key={pos} className="chip">
                <input 
                  type="checkbox" 
                  checked={positionsFilter.includes(pos)} 
                  onChange={() => togglePosition(pos)}
                  className="mr-2"
                />
                {pos}
              </label>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="protocol-skeleton" aria-busy="true" />
      ) : listings.length === 0 ? (
        <div className="protocol-card p-8 text-center text-muted-foreground">
          No listings match your filters
        </div>
      ) : (
        <div className="lfg-grid">
          {listings.map(listing => (
            <LfgItem 
              key={listing.id} 
              listing={listing} 
              isOwner={listing.user_id === currentUserId}
              onUpdate={loadListings}
            />
          ))}
        </div>
      )}
    </div>
  );
}
