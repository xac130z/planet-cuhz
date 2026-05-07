import { useState } from 'react';
import { adminAction } from '@/lib/admin';
import { toast } from 'sonner';

interface Flag {
  id: string;
  listing_id: string;
  reason: string;
  details: string;
  created_at: string;
  listing: any;
}

export default function ModerationQueue({ flags, onRefresh }: { flags: Flag[]; onRefresh: () => void }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: string, flagId: string, listingId: string, userId?: string) => {
    try {
      setLoading(flagId);
      
      if (action === 'ban_user' && userId) {
        await adminAction('ban_user', { userId, reason: 'Flagged content', days: 30 });
        toast.success('User banned');
      } else if (action === 'close') {
        await adminAction('close_listing', { listingId, flagId });
        toast.success('Listing closed');
      } else if (action === 'delete') {
        await adminAction('delete_listing', { listingId, flagId });
        toast.success('Listing deleted');
      } else if (action === 'approve') {
        // Just close the flag without action
        await adminAction('close_listing', { listingId, flagId });
        toast.success('Flag dismissed');
      }
      
      onRefresh();
    } catch (error) {
      toast.error(`Action failed: ${error}`);
    } finally {
      setLoading(null);
    }
  };

  if (flags.length === 0) {
    return (
      <div className="protocol-card" style={{ padding: 20 }}>
        <p className="text-muted-foreground">No pending flags</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {flags.map((flag) => (
        <article key={flag.id} className="protocol-card" style={{ padding: 16 }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge flagged">{flag.reason}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(flag.created_at).toLocaleDateString()}
                </span>
              </div>
              
              {flag.listing && (
                <>
                  <h3 className="font-semibold mb-1">{flag.listing.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{flag.listing.notes}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>Role: {flag.listing.role}</span>
                    <span>•</span>
                    <span>Platform: {flag.listing.platform}</span>
                  </div>
                </>
              )}
              
              {flag.details && (
                <p className="text-sm text-muted-foreground mt-2 italic">{flag.details}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                className="protocol-btn-sm"
                onClick={() => handleAction('approve', flag.id, flag.listing_id)}
                disabled={loading === flag.id}
              >
                Dismiss
              </button>
              <button
                className="protocol-btn-sm"
                onClick={() => handleAction('close', flag.id, flag.listing_id)}
                disabled={loading === flag.id}
              >
                Close
              </button>
              <button
                className="protocol-btn-sm"
                onClick={() => handleAction('delete', flag.id, flag.listing_id)}
                disabled={loading === flag.id}
              >
                Delete
              </button>
              {flag.listing?.user_id && (
                <button
                  className="protocol-btn-sm"
                  onClick={() => handleAction('ban_user', flag.id, flag.listing_id, flag.listing.user_id)}
                  disabled={loading === flag.id}
                >
                  Ban User
                </button>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
