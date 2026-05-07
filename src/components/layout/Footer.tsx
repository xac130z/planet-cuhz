import { Link } from "react-router-dom";

const FOOTER_LINKS = {
  Platform: [
    { label: "2K Protocol", href: "/protocol" },
    { label: "Cuhz Bot", href: "/bot" },
    { label: "Rankings", href: "/tournament-of-power" },
    { label: "Coaches", href: "/coaches" },
  ],
  Resources: [
    { label: "Whitepaper", href: "/whitepaper" },
    { label: "FAQ", href: "/faq" },
    { label: "Changelog", href: "/changelog" },
    { label: "Help & Support", href: "/help-support" },
  ],
  Community: [
    { label: "Discord", href: "https://discord.gg/5rFRaeBuHn", external: true },
    { label: "X / Twitter", href: "https://x.com/PlanetCuhz", external: true },
    { label: "Twitch", href: "https://twitch.tv/planetcuhz", external: true },
    { label: "Linktree", href: "https://linktr.ee/PlanetCUHZ", external: true },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/legal" },
    { label: "Terms of Service", href: "/legal" },
    { label: "Press Kit", href: "/press-kit" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle/50 bg-void">
      <div className="container section-padding">
        {/* Link Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-semibold text-sm text-bright-text mb-4 uppercase tracking-wider">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-text hover:text-cosmic-blue transition-colors"
                      >
                        {link.label} ↗
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-muted-text hover:text-cosmic-blue transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border-subtle/30">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-cosmic flex items-center justify-center text-white font-display font-black text-[10px]">
              PC
            </div>
            <span className="font-display font-semibold text-sm text-bright-text">
              Planet CUHZ
            </span>
          </div>
          <p className="text-xs text-muted-text">
            © {new Date().getFullYear()} Planet CUHZ — A VQNC Labs property. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://discord.gg/5rFRaeBuHn" target="_blank" rel="noopener noreferrer" className="text-muted-text hover:text-cosmic-blue transition-colors" aria-label="Discord">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03z"/></svg>
            </a>
            <a href="https://x.com/PlanetCuhz" target="_blank" rel="noopener noreferrer" className="text-muted-text hover:text-cosmic-blue transition-colors" aria-label="X">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://twitch.tv/planetcuhz" target="_blank" rel="noopener noreferrer" className="text-muted-text hover:text-cosmic-blue transition-colors" aria-label="Twitch">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
