
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Trophy, Shield, FileText, HelpCircle, Bot } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/protocol', label: 'Protocol', icon: Shield, dataTestId: 'nav-protocol' },
  { href: '/bot', label: 'Bot', icon: Bot, dataTestId: 'nav-bot' },
  { href: '/coaches', label: 'Coaches', icon: Trophy },
  { href: '/tournament-of-power', label: 'AI Rankings', icon: Trophy },
  { href: '/whitepaper', label: 'Whitepaper', icon: FileText },
  { href: '/help-support', label: 'Help', icon: HelpCircle },
];

export function NavigationMenu() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (href: string) => {
    if (href.startsWith('/whitepaper#')) {
      // Handle whitepaper section links
      const section = href.split('#')[1];
      navigate('/whitepaper');
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (href.startsWith('#')) {
      // Handle homepage sections
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
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

  return (
    <nav className="hidden lg:flex items-center space-x-1" role="navigation">
      {navLinks.map((link) => {
        const IconComponent = link.icon;
        const isActive = isActiveRoute(link.href);
        return (
          <button 
            key={link.href} 
            onClick={() => handleNavClick(link.href)}
            data-testid={link.dataTestId}
            className={`relative flex items-center space-x-2 transition-all duration-300 font-medium group cursor-pointer px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9370DB]/50 ${
              isActive 
                ? 'text-[#9370DB] bg-[#9370DB]/20 shadow-lg' 
                : 'text-[#F1F5F9] hover:text-[#9370DB] hover:bg-[#9370DB]/10'
            }`}
            aria-label={`Navigate to ${link.label}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <IconComponent 
              size={16} 
              className={`transition-colors duration-300 ${
                isActive 
                  ? 'text-[#9370DB]' 
                  : 'text-[#8A2BE2] group-hover:text-[#9370DB]'
              }`} 
            />
            <span className="relative z-10 flex items-center gap-2">
              {link.label}
            </span>
            <div className={`absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-[#9370DB] to-[#4B0082] transition-transform duration-300 origin-left ${
              isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`} />
          </button>
        );
      })}
    </nav>
  );
}