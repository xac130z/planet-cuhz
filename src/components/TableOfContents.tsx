
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const tocItems = [
  { id: 'who-we-are', title: '1. Who We Are', level: 1 },
  { id: 'executive-summary', title: '2. Executive Summary', level: 1 },
  { id: 'problem-statement', title: '3. Problem Statement', level: 1 },
  { id: 'solution-overview', title: '4. Solution Overview', level: 1 },
  { id: 'cuhz-token', title: '5. The CUHZ Token (Planned)', level: 1 },
  { id: 'universal-matchmaking', title: '6. Universal Matchmaking Platform', level: 1 },
  { id: 'twitch-streamer-hub', title: '7. Best Twitch Streamer Hub', level: 1 },
  { id: 'automation-ai-suite', title: '8. Automation and AI Agent Suite', level: 1 },
  { id: 'ecosystem-extensions', title: '9. Ecosystem Extensions', level: 1 },
  { id: 'market-opportunity', title: '10. Market Opportunity and Positioning', level: 1 },
  { id: 'business-revenue', title: '11. Business and Revenue Model', level: 1 },
  { id: 'technical-architecture', title: '12. Technical Architecture', level: 1 },
  { id: 'security-transparency', title: '13. Security and Transparency', level: 1 },
  { id: 'roadmap', title: '14. Roadmap', level: 1 },
  { id: 'risks-mitigation', title: '15. Risks and Mitigation', level: 1 },
  { id: 'team-contributors', title: '16. Team and Contributors', level: 1 },
  { id: 'legal-compliance', title: '17. Legal and Compliance', level: 1 },
  { id: 'references-links', title: '18. References and Links', level: 1 },
];

export function TableOfContents() {
  const [activeSection, setActiveSection] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const sections = tocItems.map(item => document.getElementById(item.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="sticky top-40 bg-gradient-to-br from-[#1C1C1C]/90 to-[#2A1B3D]/90 backdrop-blur-lg rounded-xl p-6 border border-[#8A2BE2]/30 shadow-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full mb-4 text-[#FFD700] font-bold text-lg hover:text-[#B3A369] transition-colors"
      >
        Table of Contents
        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>
      
      {isExpanded && (
        <nav className="space-y-2">
          {tocItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`block w-full text-left py-2 px-3 rounded-lg transition-all duration-200 ${
                item.level === 2 ? 'ml-4 text-sm' : 'text-base'
              } ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-[#8A2BE2]/20 to-[#FFD700]/20 text-[#FFD700] font-semibold border-l-2 border-[#FFD700]'
                  : 'text-[#F1F5F9] hover:text-[#00BFFF] hover:bg-[#8A2BE2]/10'
              }`}
            >
              {item.title}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
