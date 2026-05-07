
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavigationMenu } from './NavigationMenu';
import { MobileMenu } from './MobileMenu';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleHomeClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Detect scroll for sticky header shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-deep-space/95 via-cosmic-purple/95 to-deep-space/95 dark:from-deep-space/95 dark:via-cosmic-purple/95 dark:to-deep-space/95 backdrop-blur-lg border-b border-electric-blue/30 transition-all duration-300 overflow-visible ${
        isScrolled 
          ? 'shadow-2xl shadow-electric-blue/10' 
          : 'shadow-lg'
      }`}
      role="banner"
      style={{ overflow: 'visible' }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
        <div className="flex items-center justify-between h-16 sm:h-20 overflow-visible">
          {/* Enhanced Brand Section - Much Larger */}
          <button 
            onClick={handleHomeClick}
            className="flex items-center space-x-3 text-white hover:text-electric-cyan transition-all duration-500 group cursor-pointer px-3 py-2 rounded-xl hover:bg-gradient-to-r hover:from-electric-blue/20 hover:to-electric-cyan/20 focus:outline-none focus:ring-2 focus:ring-electric-cyan/50 transform hover:scale-105"
            aria-label="Navigate to home page"
          >
            {/* Logo/Icon Area */}
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-electric-blue via-electric-cyan to-electric-purple p-0.5 group-hover:animate-pulse brand-glow">
              <div className="flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-deep-space to-cosmic-purple overflow-hidden">
                <img
                  src="/lovable-uploads/42e443a0-b26a-4cd9-811f-e1a5b66462c7.png"
                  alt="Planet CUHZ Logo"
                  className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 object-contain"
                  onError={(e) => {
                    console.log('Header logo failed to load');
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector('.fallback-logo')) {
                      const fallback = document.createElement('span');
                      fallback.className = 'fallback-logo text-lg sm:text-xl lg:text-2xl font-bold font-display text-electric-cyan cosmic-text-shadow';
                      fallback.textContent = '🌌';
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Enhanced Text Brand */}
            <div className="flex flex-col items-start">
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold font-display tracking-wide holographic-text group-hover:text-shadow-glow transition-all duration-500">
                Planet CUHZ
              </span>
              <span className="text-xs sm:text-sm lg:text-base text-electric-cyan font-medium -mt-0.5 group-hover:text-electric-yellow transition-colors duration-300 tracking-wider">
                Cosmic Family
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <NavigationMenu />

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
