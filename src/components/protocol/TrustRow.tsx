import React from 'react';

export const TrustRow: React.FC<{ supportEmail: string }> = ({ supportEmail }) => (
  <footer className="trust-row">
    <nav aria-label="Trust and compliance">
      <a className="link" href="/legal">Privacy</a>
      <a className="link" href="/legal">Data Use</a>
      <span className="muted">Twitch OAuth only (Phase 1)</span>
    </nav>
    <div className="support">
      Need help? <a className="link" href={`mailto:${supportEmail}`}>{supportEmail}</a>
    </div>
  </footer>
);
