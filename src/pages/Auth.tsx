import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User, Sparkles, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const PROTOCOL_URL = import.meta.env.VITE_PROTOCOL_URL || '/';

  const handleTwitchLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitch',
        options: {
          redirectTo: PROTOCOL_URL
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Twitch auth error:', error);
      toast({
        title: "Twitch Login Error",
        description: error instanceof Error ? error.message : "Failed to connect with Twitch",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
            emailRedirectTo: PROTOCOL_URL
          },
        });

        if (error) throw error;

        toast({
          title: "Welcome to the cuhzunity!",
          description: "Check your email to verify your account and begin your cosmic journey.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back, cuhz!",
          description: "Ready to continue your cosmic adventure?",
        });
        
        window.location.href = PROTOCOL_URL;
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#090b19] via-[#1C1C1C] to-[#2A1B3D]"></div>
      </div>

      {/* Starfield Background */}
      <div className="fixed inset-0 -z-5">
        <svg className="absolute inset-0 w-full h-full" width="100%" height="100%" viewBox="0 0 1920 1080">
          {[...Array(100)].map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * 1920}
              cy={Math.random() * 1080}
              r={1 + Math.random() * 2}
              fill={i % 7 === 0 ? "#B3A369" : "#A0A0A0"}
              opacity={0.3 + Math.random() * 0.7}
              style={{
                animation: `pulseStar ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 4}s`
              }}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative mb-6">
            <Sparkles className="w-16 h-16 mx-auto text-[#B3A369] animate-pulse" />
            <div className="absolute inset-0 bg-[#B3A369] rounded-full blur-xl opacity-20 animate-pulse"></div>
          </div>
          <h1 className="text-5xl font-bold text-[#F1F5F9] mb-4">Join Planet CUHZ</h1>
          <p className="text-xl text-[#A0A0A0] max-w-md mx-auto">
            Connect with your cosmic family across the universe
          </p>
        </div>

        {/* Auth Options */}
        <div className="w-full max-w-md space-y-6">
          {/* Twitch Login - Primary CTA */}
          <Button
            onClick={handleTwitchLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#9146FF] to-[#772CE8] hover:opacity-90 text-white font-bold py-4 text-lg rounded-xl transition-opacity duration-300 shadow-lg"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Gamepad2 className="w-5 h-5 mr-2" />
            )}
            Continue with Twitch
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#444]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-[#090b19] via-[#1C1C1C] to-[#2A1B3D] text-[#A0A0A0]">
                or continue with email
              </span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[#F1F5F9]">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-[#A0A0A0]" />
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pl-10 bg-[#1C1C1C]/60 border-[#444] text-[#F1F5F9] focus:border-[#B3A369]"
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[#F1F5F9]">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-[#A0A0A0]" />
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="pl-10 bg-[#1C1C1C]/60 border-[#444] text-[#F1F5F9] focus:border-[#B3A369]"
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#F1F5F9]">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-[#A0A0A0]" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-[#1C1C1C]/60 border-[#444] text-[#F1F5F9] focus:border-[#B3A369]"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#F1F5F9]">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-[#A0A0A0]" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-[#1C1C1C]/60 border-[#444] text-[#F1F5F9] focus:border-[#B3A369]"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#B3A369] to-[#CD7F32] text-[#1C1C1C] hover:opacity-90 font-bold py-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                isSignUp ? 'Join the Cuhzunity' : 'Enter Portal'
              )}
            </Button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#B3A369] hover:text-[#CD7F32] transition-colors duration-300 font-medium"
            >
              {isSignUp 
                ? "Already have an account? Sign in" 
                : "New to the cuhzunity? Join us"
              }
            </button>
          </div>

          {/* Back to Home */}
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-[#A0A0A0] hover:text-[#F1F5F9] transition-colors duration-300 text-sm"
            >
              ← Back to Planet CUHZ
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulseStar {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}