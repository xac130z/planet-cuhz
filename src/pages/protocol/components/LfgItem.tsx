import { useState } from 'react';
import { closeListing, applyToListing } from '@/lib/lfg';
import { reportListing } from '@/lib/admin';
import { useToast } from '@/hooks/use-toast';

type LfgItemProps = {
  listing: any;
  isOwner: boolean;
  onUpdate?: () => void;
};

export default function LfgItem({ listing, isOwner, onUpdate }: LfgItemProps) {
  const { toast } = useToast();
  const [applying, setApplying] = useState(false);
  const [closing, setClosing] = useState(false);
  const [reporting, setReporting] = useState(false);

  const isBoosted = listing.boost_expires_at && new Date(listing.boost_expires_at) > new Date();

  const handleApply = async () => {
    setApplying(true);
    try {
      await applyToListing({ listing_id: listing.id });
      toast({ title: 'Application sent!' });
      onUpdate?.();
    } catch (error: any) {
      if (error.message?.includes('duplicate')) {
        toast({ title: 'Already applied', variant: 'destructive' });
      } else {
        toast({ title: 'Failed to apply', variant: 'destructive' });
      }
    } finally {
      setApplying(false);
    }
  };

  const handleClose = async () => {
    setClosing(true);
    try {
      await closeListing(listing.id);
      toast({ title: 'Listing closed' });
      onUpdate?.();
    } catch (error) {
      toast({ title: 'Failed to close listing', variant: 'destructive' });
    } finally {
      setClosing(false);
    }
  };

  const handleReport = async () => {
    setReporting(true);
    try {
      await reportListing(listing.id, 'inappropriate', 'User reported via LFG interface');
      toast({ title: 'Listing reported for review' });
    } catch (error: any) {
      toast({ title: error.message || 'Failed to report', variant: 'destructive' });
    } finally {
      setReporting(false);
    }
  };

  const availability = listing.availability ? JSON.parse(listing.availability) : [];
  const availSummary = availability.length > 0 
    ? `${availability.length} time slot${availability.length !== 1 ? 's' : ''}`
    : 'No availability set';

  return (
    <article className="lfg-item">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{listing.title}</h3>
        {isBoosted && (
          <span className="lfg-badge-boost">★ Featured</span>
        )}
      </div>

      <div className="text-sm text-muted-foreground mb-3">
        by {listing.user_profiles?.display_name || 'Unknown'}
      </div>

      <div className="lfg-positions mb-3">
        {listing.needed_positions?.map((pos: string) => (
          <span key={pos} className="badge good">{pos}</span>
        ))}
      </div>

      <div className="space-y-1 text-sm mb-3">
        <div><strong>Modes:</strong> {listing.modes?.join(', ') || 'None'}</div>
        <div><strong>Platform:</strong> {listing.platform} {listing.allows_crossplay && '(Crossplay OK)'}</div>
        <div><strong>Region:</strong> {listing.region}</div>
        <div><strong>Availability:</strong> {availSummary}</div>
      </div>

      {listing.notes && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{listing.notes}</p>
      )}

      <div className="protocol-actions">
        {isOwner ? (
          <button 
            className="protocol-btn secondary" 
            onClick={handleClose}
            disabled={closing}
          >
            {closing ? 'Closing...' : 'Close Listing'}
          </button>
        ) : (
          <>
            <button 
              className="protocol-btn" 
              onClick={handleApply}
              disabled={applying}
            >
              {applying ? 'Applying...' : 'Apply'}
            </button>
            <button
              className="protocol-btn secondary"
              onClick={handleReport}
              disabled={reporting}
              style={{ fontSize: '0.875rem', padding: '8px 16px' }}
            >
              {reporting ? 'Reporting...' : 'Report'}
            </button>
          </>
        )}
      </div>
    </article>
  );
}
