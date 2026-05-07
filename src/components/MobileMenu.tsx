import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, Trophy, Users, X, Twitter, MessageCircle, ExternalLink, Shield, HelpCircle, Bot } from 'lucide-react';

interface MobileMenuProps {
  className?: string;
}

export function MobileMenu({ className = '' }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items - Full navigation mirror
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/protocol', label: 'Protocol', icon: Shield, dataTestId: 'nav-protocol' },
    { href: '/bot', label: 'Bot', icon: Bot, dataTestId: 'nav-bot' },
    { href: '/coaches', label: 'Coaches', icon: Users },
    { href: '/tournament-of-power', label: 'AI Rankings', icon: Trophy },
    { href: '/whitepaper', label: 'Whitepaper', icon: FileText },
    { href: '/help-support', label: 'Help', icon: HelpCircle },
  ];

  // CTA buttons for mobile menu
  const ctaItems = [
    { 
      href: 'https://twitter.com/planetcuhz', 
      label: 'Follow on Twitter', 
      icon: Twitter, 
      variant: 'secondary' as const,
      external: true 
    },
    { 
      href: 'https://discord.gg/eNxDKkxQdN', 
      label: 'Join Discord', 
      icon: MessageCircle, 
      variant: 'secondary' as const,
      external: true 
    },
  ];

  // Toggle menu
  const toggleMenu = () => {
    console.log('Mobile menu toggle clicked, current state:', isOpen);
    setIsOpen(!isOpen);
  };

  // Close menu
  const closeMenu = () => {
    setIsOpen(false);
  };

  // Enhanced navigation handler to support whitepaper sections
  const handleNavClick = (href: string) => {
    closeMenu();
    
    if (href.startsWith('/whitepaper#')) {
      // Handle whitepaper section links
      const section = href.split('#')[1];
      navigate('/whitepaper');
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else if (href.startsWith('#')) {
      // Handle homepage sections
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      } else {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      // Handle regular navigation
      navigate(href);
    }
  };

  // Enhanced active route detection
  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    if (href.startsWith('/whitepaper#')) {
      return location.pathname === '/whitepaper' && location.hash === '#' + href.split('#')[1];
    }
    if (href.startsWith('#')) {
      return location.pathname === '/' && location.hash === href;
    }
    return location.pathname === href;
  };

  // Close menu when clicking outside and on escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // Prevent body scroll when menu is open and handle scroll detection
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Detect scroll for sticky header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle CTA navigation
  const handleCtaClick = (href: string, external = false) => {
    closeMenu();
    if (external) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      navigate(href);
    }
  };

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <div className={`lg:hidden ${className}`}>
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="relative z-50 flex flex-col items-center justify-center w-12 h-12 p-2 rounded-lg text-white hover:text-electric-cyan transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-electric-cyan/50 dark:text-white dark:hover:text-electric-cyan"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-haspopup="true"
          tabIndex={0}
        >
          {/* Hamburger Lines with smooth animation */}
          <span
            className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-out ${
              isOpen ? 'rotate-45 translate-y-1.5' : 'translate-y-0'
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-out mt-1 ${
              isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-out mt-1 ${
              isOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-0'
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay with smooth animations */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ease-out ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        {/* Backdrop with fade animation */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMenu}
          aria-hidden="true"
        />

        {/* Menu Panel with slide-in animation */}
        <div
          ref={menuRef}
          id="mobile-menu"
          className={`fixed top-0 right-0 h-[100dvh] max-h-[100dvh] w-80 max-w-[85vw] bg-gradient-to-b from-deep-space via-cosmic-purple to-deep-space dark:from-deep-space dark:via-cosmic-purple dark:to-deep-space border-l border-electric-blue/30 shadow-2xl flex flex-col overscroll-contain touch-pan-y transform transition-all duration-300 ease-out ${
            isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
          style={{ WebkitOverflowScrolling: 'touch' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
          tabIndex={-1}
        >
            {/* Menu Header */}
            <div className="shrink-0 flex items-center justify-between p-6 border-b border-electric-blue/20">
              <h2 id="mobile-menu-title" className="text-xl font-bold text-white dark:text-white">
                Navigation
              </h2>
              <button
                onClick={closeMenu}
                className="p-2 rounded-lg text-white hover:text-electric-cyan hover:bg-white/10 dark:text-white dark:hover:text-electric-cyan dark:hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-electric-cyan/50"
                aria-label="Close menu"
                tabIndex={0}
              >
                <X size={24} />
              </button>
            </div>

            {/* Main Navigation - Scrollable Content */}
            <div className="flex-1 overflow-y-auto scroll-touch">
              <nav className="p-6" role="navigation" aria-label="Mobile navigation">
                <ul className="space-y-2" role="list">
                  {navItems.map((item, index) => {
                    const IconComponent = item.icon;
                    const isActive = isActiveRoute(item.href);

                    return (
                      <li key={item.href} role="none">
                        <button
                          onClick={() => handleNavClick(item.href)}
                          data-testid={item.dataTestId}
                          className={`flex items-center w-full p-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-electric-cyan/50 group ${
                            isActive
                              ? 'bg-electric-blue/20 text-electric-cyan border border-electric-cyan/30 dark:bg-electric-blue/20 dark:text-electric-cyan'
                              : 'text-white hover:bg-white/10 hover:text-electric-cyan dark:text-white dark:hover:bg-white/10 dark:hover:text-electric-cyan'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                          tabIndex={0}
                          role="menuitem"
                        >
                          <IconComponent 
                            size={20} 
                            className={`mr-3 flex-shrink-0 transition-transform duration-200 ${
                              !isActive ? 'group-hover:scale-110' : ''
                            }`} 
                          />
                          <span className="font-medium text-left">{item.label}</span>
                          {isActive && (
                            <div className="ml-auto w-2 h-2 bg-electric-cyan rounded-full animate-pulse" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {/* CTA Section */}
                <div className="mt-8 pt-6 border-t border-electric-blue/20">
                  <h3 className="text-sm font-semibold text-electric-cyan/70 dark:text-electric-cyan/70 mb-4 uppercase tracking-wider">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    {ctaItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.href}
                          onClick={() => handleCtaClick(item.href, item.external)}
                          className="flex items-center w-full p-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-electric-cyan/50 group text-white/80 hover:text-electric-cyan hover:bg-white/5 dark:text-white/80 dark:hover:text-electric-cyan"
                          tabIndex={0}
                          role="menuitem"
                        >
                          <IconComponent 
                            size={18} 
                            className="mr-3 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" 
                          />
                          <span className="font-medium text-left">{item.label}</span>
                          {item.external && (
                            <ExternalLink size={14} className="ml-auto opacity-50" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* More Section */}
                <div className="mt-6 pt-6 border-t border-electric-blue/20">
                  <h3 className="text-sm font-semibold text-electric-cyan/70 mb-4 uppercase tracking-wider">
                    More
                  </h3>
                  <div className="space-y-2">
                    {[
                      { href: '/community', label: 'Community', icon: Users },
                      { href: '/about', label: 'About', icon: FileText },
                      { href: '/team', label: 'Team', icon: Users },
                      { href: '/partners', label: 'Partners', icon: Users },
                      { href: '/press-kit', label: 'Press Kit', icon: FileText },
                      { href: '/changelog', label: 'Changelog', icon: FileText },
                      { href: '/legal', label: 'Legal', icon: FileText },
                    ].map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.href}
                          onClick={() => handleNavClick(item.href)}
                          className="flex items-center w-full p-3 rounded-lg text-white/80 hover:text-electric-cyan hover:bg-white/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-electric-cyan/50 group"
                        >
                          <IconComponent size={16} className="mr-3 flex-shrink-0" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </nav>
            </div>

            {/* Menu Footer */}
            <div className="shrink-0 p-6 border-t border-electric-blue/20 bg-gradient-to-r from-deep-space/80 to-cosmic-purple/80">
              <div className="text-center">
                <div className="text-sm font-medium text-electric-cyan dark:text-electric-cyan mb-1">
                  Planet CUHZ
                </div>
                <div className="text-xs text-white/60 dark:text-white/60">
                  Cosmic Family Portal
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}
