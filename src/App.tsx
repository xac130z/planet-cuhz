
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SecurityProvider } from "@/components/SecurityProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import HelpSupport from "./pages/HelpSupport";

import Whitepaper from "./pages/Whitepaper";
import TournamentOfPower from "./pages/TournamentOfPower";
import Coaches from "./pages/Coaches";
import FAQ from "./pages/FAQ";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import Tools from "./pages/Tools";
import Account from "./pages/Account";
import Protocol from "./pages/Protocol";
import ProtocolAssemblyRequest from "./pages/ProtocolAssemblyRequest";
import ProtocolFind from "./pages/ProtocolFind";
import ProtocolFAQ from "./pages/ProtocolFAQ";
import ProtocolShell from "./pages/protocol/ProtocolShell";
import AuthProtocol from "./pages/protocol/AuthProtocol";
import ProtocolCallback from "./pages/protocol/ProtocolCallback";
import OnboardingProtocol from "./pages/protocol/OnboardingProtocol";
import ProfileView from "./pages/protocol/ProfileView";
import MatchesPage from "./pages/protocol/MatchesPage";
import LfgPage from "./pages/protocol/LfgPage";
import AdminPage from "./pages/protocol/AdminPage";
import RespondPage from "./pages/protocol/RespondPage";
import Community from "./pages/Community";
import About from "./pages/About";
import TeamPage from "./pages/TeamPage";
import Partners from "./pages/Partners";
import PressKit from "./pages/PressKit";
import Changelog from "./pages/Changelog";
import Legal from "./pages/Legal";
import BotPage from "./pages/Bot";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SecurityProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/join" element={<Navigate to="/protocol/auth" replace />} />
              <Route path="/auth" element={<Navigate to="/protocol/auth" replace />} />
              
              <Route path="/tournament-of-power" element={<TournamentOfPower />} />
              <Route path="/whitepaper" element={<Whitepaper />} />
              <Route path="/help-support" element={<HelpSupport />} />
              <Route path="/coaches" element={<Coaches />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/account" element={<Account />} />
              <Route path="/protocol" element={<Protocol />} />
              <Route path="/protocol/assembly-request" element={<ProtocolAssemblyRequest />} />
              <Route path="/protocol/find" element={<ProtocolFind />} />
              <Route path="/protocol/faq" element={<ProtocolFAQ />} />
              <Route path="/protocol/auth" element={<ProtocolShell><AuthProtocol /></ProtocolShell>} />
              <Route path="/protocol/callback" element={<ProtocolCallback />} />
              <Route path="/auth/callback" element={<ProtocolCallback />} />
              <Route path="/protocol/onboarding" element={<ProtocolShell><OnboardingProtocol /></ProtocolShell>} />
              <Route path="/protocol/profile/:id" element={<ProfileView />} />
              <Route path="/protocol/lfg" element={<ProtocolShell><LfgPage /></ProtocolShell>} />
              <Route path="/protocol/matches" element={<ProtocolShell><MatchesPage /></ProtocolShell>} />
              <Route path="/protocol/respond" element={<RespondPage />} />
              <Route path="/protocol/admin" element={<ProtocolShell><AdminPage /></ProtocolShell>} />
              <Route path="/community" element={<Community />} />
              <Route path="/about" element={<About />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/press-kit" element={<PressKit />} />
              <Route path="/changelog" element={<Changelog />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/bot" element={<BotPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SecurityProvider>
    </QueryClientProvider>
  );
};

export default App;
