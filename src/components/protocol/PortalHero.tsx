import React from 'react';

export const PortalHero: React.FC = () => {
  return (
    <header className="portal-hero" role="banner">
      <div className="hero-bg" aria-hidden="true">
        <img
          src="/assets/protocol/cuhz-chain-motif.svg"
          alt=""
          width="1920"
          height="1080"
          className="hero-motif"
        />
        <img
          src="/assets/protocol/glitch-noise.png"
          alt=""
          width="1920"
          height="1080"
          className="hero-noise"
        />
      </div>

      <div className="hero-content">
        <h1 className="hero-title">
          NBA 2K Protocol — <span className="year">2K26</span>
        </h1>
        <p className="hero-sub">
          Twitch-first teammate finder. Blacked-out UI with neon outlines.
        </p>
      </div>
    </header>
  );
};
