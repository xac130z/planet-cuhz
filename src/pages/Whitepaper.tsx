
import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhitepaperContent } from '@/components/WhitepaperContent';
import { TableOfContents } from '@/components/TableOfContents';

const Whitepaper = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090b19] via-[#1C1C1C] to-[#2A1B3D]">
      <Header />
      
      <div className="pt-32">
        {/* Header Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold bg-gradient-to-r from-[#8A2BE2] via-[#FFD700] to-[#00BFFF] bg-clip-text text-transparent mb-4">
                    Planet Cuhz Whitepaper
                  </h1>
                  <p className="text-xl text-[#B3A369] font-semibold">
                    Version 3.0 – Updated August 25, 2025
                  </p>
                </div>
                <div className="text-right text-sm text-[#A0A0A0]">
                  Last Updated:<br />
                  <span className="text-[#FFD700] font-medium">August 25, 2025</span>
                </div>
              </div>
              
              <p className="text-lg text-[#F1F5F9] italic mb-8">
                Cuhzunity for Creators
              </p>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Table of Contents - Sidebar */}
              <div className="lg:col-span-1">
                <TableOfContents />
              </div>
              
              {/* Main Content */}
              <div className="lg:col-span-3">
                <WhitepaperContent />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Whitepaper;
