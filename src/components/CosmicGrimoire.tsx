import { useState } from 'react';
import { Sparkles, BookOpen, X, ChevronLeft, ChevronRight } from 'lucide-react';

export function CosmicGrimoire() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: "The Beginning",
      content: (
        <div className="space-y-6">
          <h3 className="text-xl md:text-2xl lg:text-hierarchy-h3 text-electric-cyan holographic-text mb-6 font-bold">Chapter I: Origins</h3>
          <p className="text-base md:text-lg text-white/95 leading-relaxed font-medium">
            It started simple: "cousin" became "cuz," then evolved into "cuhz" in our family. What began as household slang grew into something bigger, a way to show love and belonging.
          </p>
          <div className="border-l-4 border-electric-purple bg-electric-purple/10 pl-6 py-4 rounded-r-lg">
            <p className="text-base md:text-lg text-electric-cyan font-semibold italic">
              "We realized 'cuhz' represents universal connection. We're all family in this crazy crypto world."
            </p>
          </div>
        </div>
      )
    },
    {
      title: "The Vision",
      content: (
        <div className="space-y-6">
          <h3 className="text-xl md:text-2xl lg:text-hierarchy-h3 text-electric-cyan holographic-text mb-6 font-bold">Chapter II: Planet CUHZ</h3>
          <p className="text-base md:text-lg text-white/95 leading-relaxed font-medium">
            That's how Planet CUHZ was born, a Solana meme coin where strangers become siblings and investors become lifelong friends.
          </p>
          <div className="bg-gradient-to-r from-electric-purple/30 to-electric-cyan/30 p-6 rounded-xl border border-electric-cyan/50 animate-glow">
            <p className="text-base md:text-lg text-white font-semibold text-center">
              <span className="text-electric-cyan text-lg md:text-xl">Our Mission:</span><br className="md:hidden" />
              <span className="md:ml-2">Deliver real utility today through our live platform, AI-powered tools, and premium features (token-gating coming soon).</span>
            </p>
          </div>
        </div>
      )
    },
    {
      title: "The Ecosystem",
      content: (
        <div className="space-y-6">
          <h3 className="text-xl md:text-2xl lg:text-hierarchy-h3 text-electric-cyan holographic-text mb-6 font-bold flex items-center">
            <Sparkles className="w-6 h-6 md:w-7 md:h-7 mr-3 text-electric-cyan animate-glow" />
            Our Live Ecosystem
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-electric-cyan/10 rounded-xl border border-electric-cyan/30">
              <h4 className="text-electric-cyan text-lg md:text-xl font-bold mb-2">Live Platform</h4>
              <p className="text-white/90 text-base md:text-lg">Real-time tools and AI-powered features for creators.</p>
            </div>
            <div className="p-4 bg-electric-purple/10 rounded-xl border border-electric-purple/30">
              <h4 className="text-electric-purple text-lg md:text-xl font-bold mb-2">Future Innovations</h4>
              <p className="text-white/90 text-base md:text-lg">Community growth fuels our roadmap: custom metaverse worlds, advanced AI tools, and revolutionary crypto experiences.</p>
            </div>
            <div className="p-4 bg-electric-blue/10 rounded-xl border border-electric-blue/30">
              <h4 className="text-electric-blue text-lg md:text-xl font-bold mb-2">Tournament of Power</h4>
              <p className="text-white/90 text-base md:text-lg">Community-driven AI tools ranking system.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Join Us",
      content: (
        <div className="space-y-8 text-center">
          <h3 className="text-xl md:text-2xl lg:text-hierarchy-h3 text-electric-cyan holographic-text mb-6 font-bold">Ready to Join Planet CUHZ?</h3>
          <p className="text-base md:text-lg text-electric-blue font-bold leading-relaxed">
            Join our thriving ecosystem today, cuhz! Experience live features, AI-powered tools, and be ready for our upcoming CUHZ token launch.
          </p>
          <div className="p-8 bg-gradient-to-br from-cosmic-purple/40 to-electric-blue/40 rounded-2xl border border-electric-cyan/60 animate-glow">
            <div className="text-electric-cyan text-6xl mb-4">🚀</div>
            <p className="text-white font-bold text-lg md:text-xl">Welcome to the family, cuhz!</p>
          </div>
        </div>
      )
    }
  ];

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <section id="about" className="py-16 sm:py-22 lg:py-28 relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-electric-blue/5 via-transparent to-electric-cyan/5 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-electric-cyan/3 via-transparent to-electric-purple/3"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl lg:text-hierarchy-h2 text-electric-cyan holographic-text mb-8 lg:mb-12 text-center font-bold">The Story of CUHZ</h2>
          
          <div className="relative w-full max-w-6xl">
            {!isOpen ? (
              // Closed Book - Mobile Optimized
              <div 
                className="cosmic-book-closed cursor-pointer transform-gpu transition-all duration-500 hover:scale-105 mx-auto"
                onClick={() => setIsOpen(true)}
              >
                <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-cosmic-purple via-deep-space to-electric-blue rounded-xl shadow-2xl border-2 border-electric-cyan/60">
                  {/* Book Cover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-electric-purple/30 to-electric-cyan/30 rounded-xl"></div>
                  
                  {/* Cosmic Particles */}
                  <div className="absolute inset-0 cosmic-particles rounded-xl"></div>
                  
                  {/* Book Title */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                    <div className="text-center space-y-4">
                      <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-electric-cyan mx-auto animate-glow" />
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-electric-cyan holographic-text leading-tight">
                        The Cosmic<br />Chronicles of<br />CUHZ
                      </h3>
                      <p className="text-electric-blue/90 text-sm sm:text-base font-medium">Tap to open and discover our story</p>
                    </div>
                  </div>
                  
                  {/* Mystical Glow */}
                  <div className="absolute inset-0 rounded-xl animate-glow bg-electric-cyan/20"></div>
                </div>
              </div>
            ) : (
              // Open Book - Mobile First Design
              <div className="cosmic-book-open transform-gpu transition-all duration-700 animate-fade-in w-full">
                {/* Mobile: Single Column Layout */}
                <div className="lg:hidden relative bg-gradient-to-br from-cosmic-purple/40 to-deep-space/60 rounded-2xl shadow-2xl border-2 border-electric-cyan/60 overflow-hidden min-h-96">
                  {/* Mobile Header */}
                  <div className="flex justify-between items-center p-4 border-b border-electric-purple/30 bg-deep-space/50">
                    <h4 className="text-electric-cyan font-bold text-lg">{pages[currentPage]?.title}</h4>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="w-10 h-10 bg-electric-purple/80 rounded-full flex items-center justify-center text-white hover:bg-electric-purple transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Mobile Content */}
                  <div className="p-6 min-h-80">
                    {pages[currentPage]?.content}
                  </div>
                  
                  {/* Mobile Navigation */}
                  <div className="flex justify-between items-center p-4 border-t border-electric-purple/30 bg-deep-space/50">
                    <button 
                      onClick={prevPage}
                      disabled={currentPage === 0}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors ${
                        currentPage === 0 
                          ? 'bg-gray-600/50 cursor-not-allowed' 
                          : 'bg-electric-purple/80 hover:bg-electric-purple'
                      }`}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    
                    <div className="text-center">
                      <div className="text-electric-cyan font-bold text-lg mb-1">Page {currentPage + 1} of {pages.length}</div>
                      <div className="flex space-x-2">
                        {pages.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index === currentPage ? 'bg-electric-cyan' : 'bg-electric-blue/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <button 
                      onClick={nextPage}
                      disabled={currentPage === pages.length - 1}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors ${
                        currentPage === pages.length - 1 
                          ? 'bg-gray-600/50 cursor-not-allowed' 
                          : 'bg-electric-cyan/80 hover:bg-electric-cyan'
                      }`}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Desktop: Two Column Book Layout */}
                <div className="hidden lg:flex relative bg-gradient-to-br from-cosmic-purple/30 to-deep-space/50 rounded-2xl shadow-2xl border border-electric-cyan/50 overflow-hidden min-h-96">
                  {/* Left Page */}
                  <div className="w-1/2 p-8 border-r border-electric-purple/30 bg-gradient-to-br from-deep-space/80 to-cosmic-purple/30 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-electric-cyan/5 to-transparent"></div>
                    <div className="relative z-10">
                      {currentPage > 0 && (
                        <button 
                          onClick={prevPage}
                          className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-electric-purple/80 rounded-full flex items-center justify-center text-white hover:bg-electric-purple transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                      )}
                      <div className="h-full overflow-y-auto">
                        {pages[currentPage]?.content}
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Page */}
                  <div className="w-1/2 p-8 bg-gradient-to-bl from-deep-space/80 to-cosmic-purple/30 relative">
                    <div className="absolute inset-0 bg-gradient-to-bl from-electric-purple/5 to-transparent"></div>
                    <div className="relative z-10">
                      {currentPage < pages.length - 1 && (
                        <button 
                          onClick={nextPage}
                          className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-electric-cyan/80 rounded-full flex items-center justify-center text-white hover:bg-electric-cyan transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      )}
                      <div className="h-full flex flex-col justify-between">
                        <div className="flex-1 flex items-center justify-center">
                          {currentPage < pages.length - 1 ? (
                            <div className="text-center space-y-4">
                              <div className="text-electric-cyan text-6xl opacity-70">📖</div>
                              <p className="text-electric-blue/80 text-lg font-medium">Turn the page to continue...</p>
                            </div>
                          ) : (
                            <div className="text-center space-y-4">
                              <div className="text-electric-cyan text-6xl">✨</div>
                              <p className="text-electric-blue/90 font-bold text-xl">The End</p>
                              <p className="text-electric-purple/80 text-base">But your journey with CUHZ is just beginning!</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Page Counter */}
                        <div className="text-center text-electric-blue/70 text-base font-medium">
                          Page {currentPage + 1} of {pages.length}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Close Button */}
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 w-10 h-10 bg-electric-purple/80 rounded-full flex items-center justify-center text-white hover:bg-electric-purple transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}