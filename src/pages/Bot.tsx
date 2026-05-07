import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot as BotIcon, Send, Loader2, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// API Configuration - Ready for Express/SQLite backend
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_BOT_API_URL || '/api',
  endpoints: {
    chat: '/chat',
    history: '/history',
    clear: '/clear',
  },
};

export default function BotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Placeholder for API integration
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.chat}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: userMessage.content, history: messages }),
      // });
      // const data = await response.json();
      
      // Simulated response for demo
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `🚀 **Bot Integration Coming Soon!**\n\nThis is a placeholder response. Once the Express/SQLite backend is connected, I'll be able to:\n\n• Answer questions about Planet CUHZ\n• Help you find teammates\n• Provide AI-powered assistance\n• Remember our conversation history\n\nYour message was: "${userMessage.content}"`,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Bot API error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-8 flex flex-col max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-electric-purple to-electric-blue">
              <BotIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold holographic-text">
              CUHZ Bot
            </h1>
          </div>
          <p className="text-electric-cyan text-lg">
            AI-powered assistant for the Planet CUHZ community
          </p>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-electric-yellow/20 rounded-full border border-electric-yellow/50">
            <Sparkles className="w-4 h-4 text-electric-yellow" />
            <span className="text-electric-yellow text-sm font-medium">Beta Preview</span>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col bg-deep-space/50 backdrop-blur-sm rounded-2xl border border-electric-blue/30 overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px] max-h-[500px]">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <BotIcon className="w-16 h-16 text-electric-purple/50 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Start a conversation
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Ask me anything about Planet CUHZ, finding teammates, or get help with the platform.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-electric-purple to-electric-blue text-white'
                        : 'bg-cosmic-purple/50 border border-electric-cyan/30 text-white'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm sm:text-base">{msg.content}</p>
                    <span className="text-xs opacity-60 mt-1 block">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-cosmic-purple/50 border border-electric-cyan/30 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-electric-cyan" />
                    <span className="text-electric-cyan text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Error Display */}
          {error && (
            <div className="px-4 py-2 bg-destructive/20 border-t border-destructive/50">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-electric-blue/30 bg-deep-space/80">
            <div className="flex gap-3">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 min-h-[50px] max-h-[150px] resize-none bg-cosmic-purple/30 border-electric-blue/50 text-white placeholder:text-muted-foreground focus:border-electric-cyan"
                disabled={isLoading}
              />
              <div className="flex flex-col gap-2">
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-electric-purple to-electric-blue hover:from-electric-blue hover:to-electric-purple text-white h-12 px-4"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
                {messages.length > 0 && (
                  <Button
                    onClick={clearChat}
                    variant="outline"
                    size="sm"
                    className="text-xs border-electric-cyan/50 text-electric-cyan hover:bg-electric-cyan/10"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>

        {/* API Status Indicator */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cosmic-purple/30 rounded-full border border-electric-blue/30">
            <span className="w-2 h-2 rounded-full bg-electric-yellow animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Backend: Awaiting Express/SQLite integration
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
