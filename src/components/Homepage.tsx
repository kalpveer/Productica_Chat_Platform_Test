import { Search, Lightbulb, BarChart3, Target, Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useCreditSystem } from "@/hooks/useCreditSystem";
import { LoginModal } from "@/components/LoginModal";
import { LoadingState } from "@/components/LoadingState";
import { useState, useRef, useEffect } from "react";
import ShinyText from "./ShinyText";
import { cn } from "@/lib/utils";
import { useStartupContext } from "@/hooks/useStartupContext";
import { usePDFGenerator } from "@/hooks/usePDFGenerator";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}
const quickActions = [
  {
    id: "bizzy",
    title: "Bizzy",
    subtitle: "Business strategist",
    path: "/bizzy",
    // Hover accent color
    color: "#3b82f6",
    hoverColor: "hover:border-[#3b82f6] hover:shadow-[0_0_20px_rgba(59,130,246,0.28)]",
  },
  {
    id: "artie",
    title: "Artie",
    subtitle: "Creative designer",
    path: "/artie",
    color: "#ec4899",
    hoverColor: "hover:border-[#ec4899] hover:shadow-[0_0_20px_rgba(236,72,153,0.28)]",
  },
  {
    id: "mak",
    title: "Mak",
    subtitle: "Social media handler",
    path: "/mak",
    color: "#22c55e",
    hoverColor: "hover:border-[#22c55e] hover:shadow-[0_0_20px_rgba(34,197,94,0.28)]",
  },
  {
    id: "vira",
    title: "Vira",
    subtitle: "Virtual Co-Founder",
    path: "/vira",
    color: "#a855f7",
    hoverColor: "hover:border-[#a855f7] hover:shadow-[0_0_20px_rgba(168,85,247,0.28)]",
  },
];
export function Homepage() {
  const navigate = useNavigate();
  const { getContextString } = useStartupContext();
  const { generateReportPDF } = usePDFGenerator();
  const {
    credits,
    isLoggedIn,
    isDemoUser,
    enableDemoUser,
    showOutOfCreditsModal,
    deductCredit
  } = useCreditSystem();
  const [showLogin, setShowLogin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  const placeholders = [
    "Ask about your startup idea...",
    "Validate your business concept...",
    "Get AI-powered insights..."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Animate logo on mount
  useEffect(() => {
    setShowLogo(true);
  }, []);

  // Cycle through placeholders
  useEffect(() => {
    if (!isChatMode) {
      const interval = setInterval(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isChatMode, placeholders.length]);
  const handleQuickAction = async (path: string) => {
    if (!isLoggedIn && !isDemoUser) {
      setShowLogin(true);
      return;
    }
    if (credits <= 0) {
      showOutOfCreditsModal();
      return;
    }

    // Deduct credit for quick action
    const success = await deductCredit("Quick Action", "Homepage");
    if (success) {
      navigate(path);
    }
  };
  const handleSearch = async () => {
    if (!searchQuery.trim() || isLoading) return;
    if (!isLoggedIn && !isDemoUser) {
      setShowLogin(true);
      return;
    }
    if (credits <= 0) {
      showOutOfCreditsModal();
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: searchQuery.trim(),
      role: "user",
      timestamp: new Date(),
    };

    // Trigger chat mode after first submission
    if (!isChatMode) {
      setIsChatMode(true);
    }

    setMessages(prev => [...prev, userMessage]);
    setSearchQuery("");
    setIsLoading(true);

    // Deduct credit for analysis
    const success = await deductCredit("AI Analysis", "Homepage");
    if (!success) {
      setIsLoading(false);
      return;
    }

    try {
      // Prepare message with startup context if available
      const contextString = getContextString();
      const messageWithContext = contextString 
        ? `${contextString}\n\nUser Message: ${userMessage.content}`
        : userMessage.content;

      // Call Stack-AI API
      const response = await fetch('https://api.stack-ai.com/inference/v0/run/82daafa8-4b94-431b-989d-d482e0c29e95/688b18a8a5b76f214fb2774d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 24aca533-c147-4a96-a309-b59bf6bb9c77'
        },
        body: JSON.stringify({
          "user_id": `productica_main_${Date.now()}`,
          "in-0": messageWithContext
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.outputs?.["out-0"] || "I apologize, but I couldn't generate a response. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Stack-AI API error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  return (
    <div className="flex flex-col h-full">
      {!isChatMode ? (
        // Initial Home Interface - Clean, centered layout
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 min-h-screen">
          <div className="w-full max-w-5xl mx-auto space-y-10 sm:space-y-12">
            {/* Brand Title */}
            <div className={`text-center transition-all duration-1000 ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-raleway-dots text-foreground mb-2 tracking-wider">
                productica
              </h1>
              <p className="text-xs sm:text-sm text-text-muted font-extralight tracking-wide">
                Your AI team for startup validation.
              </p>
            </div>

            {/* Search Bar - thinner refined */}
            <div className={`relative max-w-2xl mx-auto transition-all duration-1000 delay-300 ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="relative flex items-center group">
                <Search className="absolute left-4 sm:left-5 w-5 h-5 text-text-muted z-10 transition-colors group-focus-within:text-foreground" />
                <Input 
                  type="text" 
                  placeholder={placeholders[placeholderIndex]}
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  onKeyPress={handleKeyPress} 
                  disabled={isLoading}
                  className="w-full h-12 sm:h-14 pl-12 sm:pl-14 pr-28 sm:pr-32 text-base bg-card text-card-foreground border border-border rounded-xl 
                            focus:ring-2 focus:ring-foreground/15 focus:border-foreground/20 focus:shadow-[0_6px_24px_rgba(0,0,0,0.25)]
                            transition-all duration-300 hover:border-border-hover hover:shadow-lg
                            placeholder:text-text-muted/60" 
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={!searchQuery.trim() || isLoading}
                  className="absolute right-2 sm:right-3 h-9 sm:h-11 px-5 sm:px-6 bg-foreground text-background hover:bg-foreground/90 rounded-lg
                            transition-all duration-300 border-0 text-sm sm:text-base font-medium
                            disabled:opacity-30 disabled:cursor-not-allowed shadow-sm">
                  Submit
                </Button>
              </div>
            </div>

            {/* Agent Cards - compact grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 px-2 transition-all duration-1000 delay-500 ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {quickActions.map((action, index) => (
                <button
                  key={action.id} 
                  onClick={() => handleQuickAction(action.path)}
                  onMouseEnter={() => setHoveredId(action.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group relative p-5 bg-card text-card-foreground border border-border rounded-xl shadow-sm transform
                           transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg active:scale-95"
                  style={{
                    borderColor: hoveredId === action.id ? action.color : undefined,
                    transitionDelay: `${index * 100}ms`
                  }}
                >
                  {/* Soft glow */}
                  <div 
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      boxShadow: hoveredId === action.id 
                        ? `0 0 24px ${action.color}33, inset 0 0 24px ${action.color}14`
                        : 'none'
                    }}
                  />
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="mb-1">
                      <ShinyText 
                        text={action.title}
                        disabled={hoveredId === action.id}
                        speed={3}
                        className="text-xl font-semibold"
                      />
                    </div>
                    <div className="text-xs sm:text-sm text-text-muted font-light">
                      {action.subtitle}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Empty State Message */}
            <div className={`text-center transition-all duration-1000 delay-700 ${showLogo ? 'opacity-100' : 'opacity-0'}`}>
              <p className="text-sm text-text-muted/60 font-light">
                Start a conversation with one of your AI teammates to validate your idea.
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Chat Mode Interface
        <>
          {/* Top Header with Logo */}
          <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 py-4 border-b border-border animate-slide-in-right">
            <div className="flex items-center">
              <h1 className="text-2xl sm:text-3xl font-raleway-dots text-foreground">productica</h1>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="w-full max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-4 animate-fade-in",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-card-foreground"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      {message.role === "assistant" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => generateReportPDF(message.content, "Productica")}
                          className="h-6 px-2 text-xs hover:bg-accent/20"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          PDF
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {message.role === "user" && (
                    <div className="w-8 h-8 bg-secondary border border-border rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-foreground">U</span>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <LoadingState 
                  variant="typing" 
                  message="Analyzing your idea..." 
                />
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Bottom Chat Bar */}
          <div className="flex-shrink-0 border-t border-border bg-background/95 backdrop-blur animate-slide-in-right">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="w-full max-w-4xl mx-auto">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 sm:left-4 w-4 h-4 sm:w-5 sm:h-5 text-text-muted z-10" />
                  <Input 
                    type="text" 
                    placeholder="Continue the conversation..." 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                    onKeyPress={handleKeyPress} 
                    disabled={isLoading}
                    className="w-full h-12 pl-10 sm:pl-12 pr-20 sm:pr-24 text-base bg-card text-card-foreground border border-border rounded-full 
                              focus:ring-2 focus:ring-ring focus:ring-opacity-50 focus:border-ring
                              transition-all duration-200 hover:border-border-hover placeholder:text-text-muted" 
                  />
                  <Button 
                    onClick={handleSearch} 
                    disabled={!searchQuery.trim() || isLoading}
                    className="absolute right-1 sm:right-2 h-8 px-4 sm:px-6 bg-primary text-primary-foreground hover:bg-primary-hover rounded-full
                              transition-all duration-200 border-0 text-sm disabled:opacity-50">
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <LoginModal open={showLogin} onOpenChange={setShowLogin} onDemoUser={enableDemoUser} />
    </div>
  );
}