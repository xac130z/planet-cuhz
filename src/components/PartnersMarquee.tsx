import { PARTNERS } from "@/data/partners";

export default function PartnersMarquee() {
  return (
    <section aria-labelledby="partners-title" className="partners-section">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 id="partners-title" className="text-3xl md:text-4xl font-display font-bold mb-4 holographic-text cosmic-text-shadow">
            Our Cosmic Partners & Tools
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powered by cutting-edge AI and blockchain technology to deliver the ultimate cosmic experience
          </p>
        </div>

        {/* Mobile/Tablet Grid */}
        <div className="partners-grid" role="list" data-testid="partners-grid">
          {PARTNERS.map((partner) => (
            <a
              key={partner.id}
              role="listitem"
              data-partner-item
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={partner.name}
              className="logo-card"
            >
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                width={160}
                height={64}
                loading="lazy"
                decoding="async"
                className="partner-logo"
              />
            </a>
          ))}
        </div>

        {/* Desktop Marquee */}
        <div className="partners-marquee" aria-hidden="true" data-testid="partners-marquee">
          <div className="marquee-track">
            {PARTNERS.concat(PARTNERS).map((partner, i) => (
              <img
                key={`${partner.id}-${i}`}
                src={partner.logo}
                alt=""
                width={160}
                height={64}
                loading="lazy"
                decoding="async"
                className="partner-logo-marquee"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
