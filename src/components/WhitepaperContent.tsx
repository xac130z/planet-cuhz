import React from 'react';
import { BetaBadge } from '@/components/ui/beta-badge';

export function WhitepaperContent() {
  return (
    <div className="bg-gradient-to-br from-[#1C1C1C]/90 to-[#2A1B3D]/90 backdrop-blur-lg rounded-xl p-8 border border-[#8A2BE2]/30 shadow-lg">
      <div className="prose prose-invert max-w-none">
        
        {/* 1. Who We Are */}
        <section id="who-we-are" className="mb-12">
          <h2 className="text-3xl font-display font-bold text-[#FFD700] mb-6 border-b border-[#8A2BE2]/30 pb-3">
            1. Who We Are
          </h2>
          <p className="text-[#F1F5F9] leading-relaxed mb-6">
            Planet Cuhz is a creator-first, AI-powered ecosystem on Solana. We build practical tools that help Twitch streamers, gamers, and digital creators grow, automate, collaborate, and monetize while turning community energy into lasting cultural products.
          </p>
          
          <div className="bg-gradient-to-r from-[#8A2BE2]/20 to-[#FFD700]/20 rounded-lg p-6 mb-6">
            <div className="space-y-4">
              <p className="text-[#F1F5F9] leading-relaxed">
                <strong className="text-[#FFD700]">What we believe:</strong> culture should own the rails.
              </p>
              <p className="text-[#F1F5F9] leading-relaxed">
                <strong className="text-[#00BFFF]">What we build:</strong> tools that convert attention into opportunity.
              </p>
              <p className="text-[#F1F5F9] leading-relaxed">
                <strong className="text-[#8A2BE2]">How we do it:</strong> a unified Command Center with AI agents, matchmaking, and premium features (token-gating coming soon with CUHZ).
              </p>
            </div>
          </div>
        </section>

        {/* 2. Executive Summary */}
        <section id="executive-summary" className="mb-12">
          <h2 className="text-3xl font-display font-bold text-[#FFD700] mb-6 border-b border-[#8A2BE2]/30 pb-3">
            2. Executive Summary
          </h2>
          <p className="text-[#F1F5F9] leading-relaxed mb-6">
            Planet Cuhz blends meme culture, utility software, and the creator economy. The platform delivers an AI-enhanced Command Center, a Universal Matchmaking Platform, and a Twitch Streamer Hub, with a broader roadmap that includes a Launchpad, metaverse, NFTs, a clothing line, serialized media, and game creation.
          </p>
          
          <div className="bg-gradient-to-r from-[#8A2BE2]/20 to-[#FFD700]/20 rounded-lg p-6 mb-6">
            <p className="text-[#F1F5F9] leading-relaxed mb-4">
              CUHZ will be the utility token that powers identity, access, and incentives (coming soon). Premium features will unlock at token-gated tiers. Burns will be tied to real product milestones.
            </p>
          </div>
        </section>

        {/* 3. Problem Statement */}
        <section id="problem-statement" className="mb-12">
          <h2 className="text-3xl font-display font-bold text-[#FFD700] mb-6 border-b border-[#8A2BE2]/30 pb-3">
            3. Problem Statement
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#8A2BE2]/10 to-[#FFD700]/10 rounded-lg p-6 border border-[#8A2BE2]/20">
              <ul className="space-y-2 text-[#F1F5F9]">
                <li>• Fragmented toolchains and high costs for streamers and creators</li>
                <li>• Limited collaboration rails for teams, collabs, and brand fits</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-[#00BFFF]/10 to-[#8A2BE2]/10 rounded-lg p-6 border border-[#00BFFF]/20">
              <ul className="space-y-2 text-[#F1F5F9]">
                <li>• Speculative tokens without real products</li>
                <li>• Security and trust concerns from opaque mechanics and rugpulls</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. Solution Overview */}
        <section id="solution-overview" className="mb-12">
          <h2 className="text-3xl font-display font-bold text-[#FFD700] mb-6 border-b border-[#8A2BE2]/30 pb-3">
            4. Solution Overview
          </h2>
          <p className="text-[#F1F5F9] leading-relaxed mb-6">
            Planet Cuhz provides a single entry point, the Command Center, that orchestrates:
          </p>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-[#8A2BE2]/20 to-[#FFD700]/20 rounded-lg p-4">
              <ul className="space-y-2 text-[#F1F5F9]">
                <li>• <strong className="text-[#00BFFF]">Best Twitch Streamer Hub:</strong> AI moderation, marketing swarms, deal discovery, overlays, analytics <BetaBadge size="sm" variant="glow" /></li>
                <li>• <strong className="text-[#FFD700]">Universal Matchmaking Platform:</strong> AI and optional spiritual matching for creators, streamers, teams, and brands <BetaBadge size="sm" variant="glow" /></li>
                <li>• <strong className="text-[#8A2BE2]">Automation of Ecosystem Tasks:</strong> AI agents triage proposals, schedule content, trigger promos, and post proofs <BetaBadge size="sm" variant="pulse" /></li>
                <li>• <strong className="text-[#00BFFF]">Launchpad:</strong> token-gated incubation for creator projects, games, and media (Planned)</li>
                <li>• <strong className="text-[#FFD700]">Metaverse and NFTs:</strong> identity portability, collectibles, event access (Planned)</li>
                <li>• <strong className="text-[#8A2BE2]">Education and Communities:</strong> AI University, NBA 2K Hub, GTA 6 Army, Stream Swarms (Planned/Live)</li>
                <li>• <strong className="text-[#00BFFF]">Media and Commerce:</strong> clothing line, cartoon show, AI agent Telegram Search Shop, streaming platform pilots (Planned/Beta)</li>
              </ul>
            </div>
            
            <p className="text-[#F1F5F9] leading-relaxed">
              All access and incentives will be unified by CUHZ with tiered utility (token launching soon).
            </p>
          </div>
        </section>

        {/* 5. The CUHZ Token */}
        <section id="cuhz-token" className="mb-12">
          <h2 className="text-3xl font-display font-bold text-[#FFD700] mb-6 border-b border-[#8A2BE2]/30 pb-3">
            5. The CUHZ Token (Planned)
          </h2>
          
          {/* Coming Soon Banner */}
          <div className="bg-gradient-to-r from-[#FFD700]/20 to-[#8A2BE2]/20 rounded-lg p-4 mb-6 border border-[#FFD700]/40">
            <p className="text-[#FFD700] font-bold text-center">
              🚀 Coming Soon — The CUHZ token is currently in development. All specifications below are planned and subject to change.
            </p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#00BFFF] mb-4">5.1 Planned Token Details</h3>
            <div className="overflow-x-auto bg-gradient-to-r from-[#1C1C1C]/50 to-[#2A1B3D]/50 rounded-lg p-4">
              <table className="w-full text-[#F1F5F9]">
                <tbody className="space-y-2">
                  <tr className="border-b border-[#8A2BE2]/20">
                    <td className="py-2 font-bold text-[#FFD700]">Token name</td>
                    <td className="py-2">Planet Cuhz</td>
                  </tr>
                  <tr className="border-b border-[#8A2BE2]/20">
                    <td className="py-2 font-bold text-[#FFD700]">Ticker</td>
                    <td className="py-2">CUHZ</td>
                  </tr>
                  <tr className="border-b border-[#8A2BE2]/20">
                    <td className="py-2 font-bold text-[#FFD700]">Chain</td>
                    <td className="py-2">Solana (SPL)</td>
                  </tr>
                  <tr className="border-b border-[#8A2BE2]/20">
                    <td className="py-2 font-bold text-[#FFD700]">Planned total supply</td>
                    <td className="py-2">1,000,000,000 CUHZ</td>
                  </tr>
                  <tr className="border-b border-[#8A2BE2]/20">
                    <td className="py-2 font-bold text-[#FFD700]">Contract</td>
                    <td className="py-2 text-sm break-all text-[#A0A0A0] italic">TBA — Contract address will be announced at launch</td>
                  </tr>
                  <tr className="border-b border-[#8A2BE2]/20">
                    <td className="py-2 font-bold text-[#FFD700]">Planned launch platform</td>
                    <td className="py-2">Pump.fun with Raydium graduation target</td>
                  </tr>
                  <tr className="border-b border-[#8A2BE2]/20">
                    <td className="py-2 font-bold text-[#FFD700]">Liquidity</td>
                    <td className="py-2">Will be locked monthly with public proofs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#00BFFF] mb-4">5.2 Planned Allocation</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[#8A2BE2]/10 to-[#FFD700]/10 rounded-lg p-6 border border-[#8A2BE2]/20">
                <ul className="space-y-2 text-[#F1F5F9]">
                  <li><strong className="text-[#00BFFF]">Liquidity Pool:</strong> ~74% (planned)</li>
                  <li><strong className="text-[#00BFFF]">Dev Wallet:</strong> ~10% with planned lock and vesting after launch</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-[#00BFFF]/10 to-[#8A2BE2]/10 rounded-lg p-6 border border-[#00BFFF]/20">
                <ul className="space-y-2 text-[#F1F5F9]">
                  <li><strong className="text-[#FFD700]">Marketing and CEX:</strong> ~10% with milestone-based releases</li>
                  <li><strong className="text-[#FFD700]">Community Airdrops and Events:</strong> ~5% phased, anti-bot, engagement-weighted</li>
                </ul>
              </div>
            </div>
            <p className="text-[#A0A0A0] text-sm italic mt-4">* Final allocation percentages will be confirmed at token launch</p>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#00BFFF] mb-4">5.3 Planned Burn Policy</h3>
            <div className="bg-gradient-to-r from-[#FF4500]/20 to-[#FFD700]/20 rounded-lg p-6 border border-[#FF4500]/30">
              <ul className="space-y-2 text-[#F1F5F9]">
                <li>• <strong className="text-[#FFD700]">Initial Burn:</strong> Planned burn at Raydium graduation</li>
                <li>• <strong className="text-[#FFD700]">Ongoing:</strong> Governance will allocate a share of ecosystem revenues to scheduled burns</li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-[#00BFFF] mb-4">5.4 Planned Utility Tiers</h3>
            <p className="text-[#A0A0A0] text-sm italic mb-4">These tiers will be activated once the CUHZ token launches</p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-[#8A2BE2]/20 to-[#FFD700]/20 rounded-lg p-6 border border-[#8A2BE2]/30 opacity-80">
                <h4 className="text-lg font-bold text-[#FFD700] mb-3">Basic: 0+ CUHZ</h4>
                <ul className="space-y-1 text-sm text-[#F1F5F9]">
                  <li>• Command Center access</li>
                  <li>• Governance voting</li>
                  <li>• Matchmaking browsing</li>
                  <li>• Base analytics</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-[#FFD700]/20 to-[#00BFFF]/20 rounded-lg p-6 border border-[#FFD700]/30 opacity-80">
                <h4 className="text-lg font-bold text-[#FFD700] mb-3">Premium: 100,000+ CUHZ</h4>
                <ul className="space-y-1 text-sm text-[#F1F5F9]">
                  <li>• Streamer AI suite</li>
                  <li>• Advanced filters</li>
                  <li>• Priority placement</li>
                  <li>• Premium overlays</li>
                  <li>• Character tools</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-[#00BFFF]/20 to-[#8A2BE2]/20 rounded-lg p-6 border border-[#00BFFF]/30 opacity-80">
                <h4 className="text-lg font-bold text-[#00BFFF] mb-3">Elite: 1,000,000+ CUHZ</h4>
                <ul className="space-y-1 text-sm text-[#F1F5F9]">
                  <li>• Concierge intros</li>
                  <li>• Launchpad priority</li>
                  <li>• Stealth projects</li>
                  <li>• Early feature flags</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Universal Matchmaking Platform */}
        <section id="universal-matchmaking" className="mb-12">
          <h2 className="text-3xl font-display font-bold text-[#FFD700] mb-6 border-b border-[#8A2BE2]/30 pb-3">
            6. Universal Matchmaking Platform <BetaBadge size="md" variant="glow" />
          </h2>
          <p className="text-[#F1F5F9] leading-relaxed mb-6">
            <strong>Purpose:</strong> a cross-domain matching engine for streamers, gamers, creators, and brands powered by multi-factor AI. Inputs include skills, interests, schedule, goals, and optional spiritual alignment using numerology and astrology. Token-gated tiers ensure quality.
          </p>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#8A2BE2]/20 to-[#FFD700]/20 rounded-lg p-6">
              <p className="text-[#F1F5F9] leading-relaxed mb-4">
                <strong className="text-[#00BFFF]">Status:</strong> Live for core matching. Beta for advanced streamer analytics and brand fit.
              </p>
              <p className="text-[#F1F5F9] leading-relaxed mb-4">
                <strong className="text-[#FFD700]">Workflow:</strong> onboard, verify socials or wallet, receive AI-ranked matches, request a safe intro, collaborate in a shared Command Center workspace, rate the match to improve the model.
              </p>
              <p className="text-[#F1F5F9] leading-relaxed">
                <strong className="text-[#8A2BE2]">Highlights:</strong> configurable weights with defaults of 40% spiritual, 25% personality, 20% interests, 15% lifestyle. Team builder for NBA 2K Hub. Creator briefs with budgets for the Launchpad. Premium tiers increase priority and unlock advanced filters and auto-intros.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-[#00BFFF]/20 to-[#8A2BE2]/20 rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#00BFFF] mb-3">Privacy and Safety</h3>
              <p className="text-[#F1F5F9] leading-relaxed">
                Row Level Security, consent-based data, rate limits, abuse reports, export or delete on request.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Best Twitch Streamer Hub */}
        <section id="twitch-streamer-hub" className="mb-12">
          <h2 className="text-3xl font-display font-bold text-[#FFD700] mb-6 border-b border-[#8A2BE2]/30 pb-3">
            7. Best Twitch Streamer Hub <BetaBadge size="md" variant="glow" />
          </h2>
          <p className="text-[#F1F5F9] leading-relaxed mb-6">
            <strong className="text-[#00BFFF]">Status:</strong> Live and Beta. Modules include AI chat moderation and safety, Swarm Marketer for social posting, Dealer AI for affiliate deal discovery, Observer analytics, and Stream Swarms for coordinated promotion.
          </p>
        </section>

        {/* 8. Command Center */}
        <section id="command-center" className="mb-12">
          <h2 className="text-3xl font-display font-bold text-[#FFD700] mb-6 border-b border-[#8A2BE2]/30 pb-3">
            8. Command Center <BetaBadge size="md" variant="glow" />
          </h2>
          <p className="text-[#F1F5F9] leading-relaxed mb-6">
            <strong className="text-[#00BFFF]">Status:</strong> Live and Beta. Centralizes tools, governance, and AI agents. Hosts the PFP Customization Tool, Daily Governance, and automation for recurring tasks.
          </p>
        </section>

        {/* 9. Automation and AI Agent Suite */}
        <section id="automation-ai-suite" className="mb-12">
          <h2 className="text-3xl font-display font-bold text-[#FFD700] mb-6 border-b border-[#8A2BE2]/30 pb-3">
            9. Automation and AI Agent Suite <BetaBadge size="md" variant="pulse" />
          </h2>
          <p className="text-[#F1F5F9] leading-relaxed mb-6">
            AI Agent Twitch Swarm, Sentinel, Dealer, Observer, Floor General, AI Agent Telegram Search Shop. <strong className="text-[#00BFFF]">Status:</strong> Live and Beta for core, expansions planned.
          </p>
        </section>

        {/* 10. Ecosystem Extensions */}
        <section id="ecosystem-extensions" className="mb-12">
          <h2 className="text-3xl font-display font-bold text-[#FFD700] mb-6 border-b border-[#8A2BE2]/30 pb-3">
            10. Ecosystem Extensions
          </h2>
          <p className="text-[#F1F5F9] leading-relaxed mb-6">
            Launchpad, Metaverse, NFTs, Clothing Line, Cartoon Show, Streaming Platform, AI University, GTA 6 Army, NBA 2K Hub, Game Creation Studio. <strong className="text-[#00BFFF]">Status:</strong> Planned or Beta.
          </p>
        </section>

        {/* 11. Market Opportunity and Positioning */}
        <section id="market-opportunity" className="mb-12">
          <h2 className="text-3xl font-display font-bold text-[#FFD700] mb-6 border-b border-[#8A2BE2]/30 pb-3">
            11. Market Opportunity and Positioning
          </h2>
          <p className="text-[#F1F5F9] leading-relaxed mb-6">
            Streaming and gaming are underserved by integrated AI and token ecosystems. Planet Cuhz positions itself as the unified, token-aware alternative.
          </p>
        </section>

        {/* 12. Business and Revenue Model */}
        <section id="business-revenue" className="mb-12">
          <h2 className="text-3xl font-display font-bold text-[#FFD700] mb-6 border-b border-[#8A2BE2]/30 pb-3">
            12. Business and Revenue Model
          </h2>
          <p className="text-[#F1F5F9] leading-relaxed mb-6">
            Premium access, commerce, NFTs, Launchpad, media, licensing. Token flywheel with burns tied to usage. Revenue split pending governance vote Q4 2025.
          </p>
        </section>

        {/* 13. Governance and DAO Framework */}
        <section id="governance-dao" className="mb-12">
          <h2 className="text-3xl font-display font-bold text-[#FFD700] mb-6 border-b border-[#8A2BE2]/30 pb-3">
            13. Governance and DAO Framework
          </h2>
          <div className="space-y-4">
            <p className="text-[#F1F5F9] leading-relaxed">
              <strong className="text-[#00BFFF]">Phase 1:</strong> AI Governor, off-chain voting
            </p>
            <p className="text-[#F1F5F9] leading-relaxed">
              <strong className="text-[#FFD700]">Phase 2:</strong> Planned on-chain governance in 2026
            </p>
          </div>
        </section>

        {/* 14. Technical Architecture */}
        <section id="technical-architecture" className="mb-12">
          <h2 className="text-3xl font-display font-bold text-[#FFD700] mb-6 border-b border-[#8A2BE2]/30 pb-3">
            14. Technical Architecture
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#8A2BE2]/10 to-[#FFD700]/10 rounded-lg p-6 border border-[#8A2BE2]/20">
              <ul className="space-y-2 text-[#F1F5F9]">
                <li><strong className="text-[#00BFFF]">Frontend:</strong> React 18, TypeScript</li>
                <li><strong className="text-[#00BFFF]">Backend:</strong> Supabase</li>
                <li><strong className="text-[#00BFFF]">Blockchain:</strong> Solana SPL</li>
                <li><strong className="text-[#00BFFF]">AI:</strong> GPT-class models</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-[#00BFFF]/10 to-[#8A2BE2]/10 rounded-lg p-6 border border-[#00BFFF]/20">
              <ul className="space-y-2 text-[#F1F5F9]">
                <li><strong className="text-[#FFD700]">APIs:</strong> Twitch, Discord, Twitter</li>
                <li><strong className="text-[#FFD700]">Security:</strong> multisig, RLS, validation</li>
                <li><strong className="text-[#FFD700]">Scalability:</strong> horizontal scale</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 15. Security and Transparency */}
        <section id="security-transparency" className="mb-12">
          <h2 className="text-3xl font-display font-bold text-[#FFD700] mb-6 border-b border-[#8A2BE2]/30 pb-3">
            15. Security and Transparency
          </h2>
          <p className="text-[#F1F5F9] leading-relaxed mb-6">
            Liquidity locked monthly. Dev wallet lock pending. Audits pending. Wallets publicly labeled.
          </p>
        </section>

        {/* 16. Roadmap */}
        <section id="roadmap" className="mb-12">
          <h2 className="text-3xl font-display font-bold text-[#FFD700] mb-6 border-b border-[#8A2BE2]/30 pb-3">
            16. Roadmap
          </h2>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#8A2BE2]/20 to-[#FFD700]/20 rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#FFD700] mb-3">Q3 2025</h3>
              <p className="text-[#F1F5F9] leading-relaxed">Twitch AI Hub beta, UMP advanced analytics</p>
            </div>
            
            <div className="bg-gradient-to-r from-[#00BFFF]/20 to-[#8A2BE2]/20 rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#00BFFF] mb-3">Q4 2025</h3>
              <p className="text-[#F1F5F9] leading-relaxed">Raydium graduation, 5M CUHZ burn, brand matching pilot</p>
            </div>
            
            <div className="bg-gradient-to-r from-[#FFD700]/20 to-[#00BFFF]/20 rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#FFD700] mb-3">Q1 2026</h3>
              <p className="text-[#F1F5F9] leading-relaxed">Launchpad alpha, NBA 2K tournaments, AI University v1</p>
            </div>
            
            <div className="bg-gradient-to-r from-[#8A2BE2]/20 to-[#FFD700]/20 rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#8A2BE2] mb-3">Q2 2026</h3>
              <p className="text-[#F1F5F9] leading-relaxed">GTA 6 Army, Metaverse alpha</p>
            </div>
            
            <div className="bg-gradient-to-r from-[#00BFFF]/20 to-[#8A2BE2]/20 rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#00BFFF] mb-3">Q3 2026+</h3>
              <p className="text-[#F1F5F9] leading-relaxed">Game creation pilots, DAO contracts</p>
            </div>
          </div>
        </section>

        {/* 17. Risks and Mitigation */}
        <section id="risks-mitigation" className="mb-12">
          <h2 className="text-3xl font-display font-bold text-[#FFD700] mb-6 border-b border-[#8A2BE2]/30 pb-3">
            17. Risks and Mitigation
          </h2>
          <p className="text-[#F1F5F9] leading-relaxed mb-6">
            Adoption risk, regulatory risk, technical risk, community risk. Each has mitigation strategies in place.
          </p>
        </section>

        {/* 18. Team and Contributors */}
        <section id="team-contributors" className="mb-12">
          <h2 className="text-3xl font-display font-bold text-[#FFD700] mb-6 border-b border-[#8A2BE2]/30 pb-3">
            18. Team and Contributors
          </h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-[#8A2BE2]/20 to-[#FFD700]/20 rounded-lg p-6">
              <p className="text-[#F1F5F9] leading-relaxed mb-2">
                <strong className="text-[#FFD700]">Founder:</strong> @xAc130z
              </p>
              <p className="text-[#F1F5F9] leading-relaxed mb-2">
                <strong className="text-[#00BFFF]">AI Agents:</strong> Dealer, Swarm, Sentinel, Observer, Floor General
              </p>
              <p className="text-[#F1F5F9] leading-relaxed">
                <strong className="text-[#8A2BE2]">Dev Wallet:</strong> 10% locked after Raydium graduation (Pending)
              </p>
            </div>
          </div>
        </section>

        {/* 19. Legal and Compliance */}
        <section id="legal-compliance" className="mb-12">
          <h2 className="text-3xl font-display font-bold text-[#FFD700] mb-6 border-b border-[#8A2BE2]/30 pb-3">
            19. Legal and Compliance
          </h2>
          <p className="text-[#F1F5F9] leading-relaxed mb-6">
            Informational only. CUHZ confers no equity or guaranteed return. Features marked Beta or Pending may evolve.
          </p>
        </section>

        {/* 20. References and Links */}
        <section id="references-links" className="mb-12">
          <h2 className="text-3xl font-display font-bold text-[#FFD700] mb-6 border-b border-[#8A2BE2]/30 pb-3">
            20. References and Links
          </h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-[#8A2BE2]/20 to-[#FFD700]/20 rounded-lg p-6">
              <ul className="space-y-2 text-[#F1F5F9]">
                <li><strong className="text-[#00BFFF]">Contract on Solscan:</strong> <span className="text-[#A0A0A0] italic">TBA — Will be announced at token launch</span></li>
                <li><strong className="text-[#FFD700]">Twitter:</strong> <a href="https://x.com/PlanetCuhz" target="_blank" rel="noopener noreferrer" className="text-[#00BFFF] hover:underline">https://x.com/PlanetCuhz</a></li>
                <li><strong className="text-[#8A2BE2]">Cuhzunity Community:</strong> <a href="https://x.com/i/communities/1933710165359923481" target="_blank" rel="noopener noreferrer" className="text-[#00BFFF] hover:underline">https://x.com/i/communities/1933710165359923481</a></li>
                <li><strong className="text-[#FFD700]">GitHub for whitepaper/docs:</strong> pending</li>
              </ul>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
}