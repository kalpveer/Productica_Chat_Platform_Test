import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessageSquare, Lightbulb, BarChart3, Users, Target, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useCreditSystem } from "@/hooks/useCreditSystem";
import { LoginModal } from "@/components/LoginModal";
import { useStartupContext } from "@/hooks/useStartupContext";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { LoadingState } from "@/components/LoadingState";
import { usePDFGenerator } from "@/hooks/usePDFGenerator";
import { useGlobalStore, AgentType } from "@/hooks/useGlobalStore";
import { useShallow } from "zustand/react/shallow";

// Import agent profile images
const ViraAvatar = "https://i.ibb.co/TB072BQ1/Vira.png";
const BizzyAvatar = "https://i.ibb.co/xq7CpvL7/Bizzy.png";
const ArtieAvatar = "https://i.ibb.co/C5Z5b9Mb/Artie.png";
const MakAvatar = "https://i.ibb.co/W4xQfq9D/Mak.jpg";


interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const moduleCards = [
  {
    id: "idea-validation",
    title: "Bizzy",
    description: "Business strategist, guides in growth and market expansion.",
    avatar: BizzyAvatar,
    path: "/bizzy",
    color: "from-accent/20 to-accent/5"
  },
  {
    id: "artie", 
    title: "Artie",
    description: "Creative designer, assists with visuals and branding.",
    avatar: ArtieAvatar,
    path: "/artie",
    color: "from-primary/20 to-primary/5"
  },
  {
    id: "mak",
    title: "Mak", 
    description: "Social media handler, automates posts and generates captions.",
    avatar: MakAvatar,
    path: "/mak",
    color: "from-secondary/40 to-secondary/10"
  },
  {
    id: "vira",
    title: "Vira",
    description: "Virtual Co-Founder, helps in making business decisions.",
    avatar: ViraAvatar,
    path: "/",
    color: "from-success/20 to-success/5"
  },
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { getContextString } = useStartupContext();
  const { generateReportPDF } = usePDFGenerator();
  const { credits, deductCredit, isLoggedIn, isDemoUser, enableDemoUser, showLoginModal, showPurchaseModal, showOutOfCreditsModal } = useCreditSystem();
  const [showLogin, setShowLogin] = useState(false);
  const { activeChatId, chats, addChat, setActiveChat, appendMessage } = useGlobalStore(useShallow((s) => ({
    activeChatId: s.activeChatId,
    chats: s.chats,
    addChat: s.addChat,
    setActiveChat: s.setActiveChat,
    appendMessage: s.appendMessage,
  })));
  
  const getModuleInfo = () => {
    switch (location.pathname) {
      case "/vira":
        return {
          title: "Vira",
          subtitle: "Virtual Co-Founder, helps in making business decisions.",
          description: "Complete validation covering idea, market, and PMF analysis.",
          avatar: ViraAvatar
        };
      case "/bizzy":
        return {
          title: "Bizzy",
          subtitle: "Business strategist, guides in growth and market expansion.",
          avatar: BizzyAvatar
        };
      case "/artie":
        return {
          title: "Artie",
          subtitle: "Creative designer, assists with visuals and branding.",
          avatar: ArtieAvatar
        };
      case "/mak":
        return {
          title: "Mak",
          subtitle: "Social media handler, automates posts and generates captions.",
          avatar: MakAvatar
        };
      default:
        return {
          title: "Welcome to Productica",
          subtitle: "Validate your startup ideas with AI-powered analysis",
          avatar: ViraAvatar
        };
    }
  };
  
  const moduleInfo = getModuleInfo();

  // Sync local messages from global store active chat for this agent
  useEffect(() => {
    const agentName = moduleInfo.title as AgentType;
    const chatList = Array.isArray(chats) ? chats : [];
    const chat = activeChatId ? chatList.find((c) => c.id === activeChatId && c.agent === agentName) : undefined;
    if (chat) {
      const mapped: Message[] = chat.messages.map((m) => ({
        id: m.id,
        content: m.content,
        role: m.role,
        timestamp: new Date(m.timestamp),
      }));
      setMessages(mapped);
    } else {
      // Keep local messages as-is if no active chat matches
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChatId, chats, location.pathname]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleModuleSelect = async (module: typeof moduleCards[0]) => {
    if (!isLoggedIn && !isDemoUser) {
      setShowLogin(true);
      return;
    }

    if (credits <= 0) {
      showOutOfCreditsModal();
      return;
    }

    // Deduct credit and navigate
    const success = await deductCredit(`Module: ${module.title}`, module.title);
    if (success && module.path !== location.pathname) {
      navigate(module.path);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!isLoggedIn && !isDemoUser) {
      setShowLogin(true);
      return;
    }

    if (credits <= 0) {
      showOutOfCreditsModal();
      return;
    }

    // Ensure active chat exists for this agent
    let chatId = activeChatId;
    const agentName = moduleInfo.title as AgentType;
    if (!chatId) {
      chatId = addChat(agentName, `Let's get started with ${agentName}.`);
      setActiveChat(chatId);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    appendMessage(chatId!, {
      id: userMessage.id,
      role: "user",
      content: userMessage.content,
      timestamp: userMessage.timestamp.toISOString(),
    });
    setInput("");
    setIsLoading(true);

    // Deduct credit for analysis
    const success = await deductCredit("AI Analysis", getModuleInfo().title);
    if (!success) {
      setIsLoading(false);
      return;
    }

    // Call Stack-AI API for Vira and Bizzy pages
    if (location.pathname === "/vira" || location.pathname === "/bizzy") {
      try {
        // Prepare message with startup context if available
        const contextString = getContextString();
        const messageWithContext = contextString 
          ? `${contextString}\n\nUser Message: ${userMessage.content}`
          : userMessage.content;

        // Different API endpoints for different agents
        const apiEndpoint = location.pathname === "/vira" 
          ? 'https://api.stack-ai.com/inference/v0/run/82daafa8-4b94-431b-989d-d482e0c29e95/688b18a8a5b76f214fb2774d'
          : 'https://api.stack-ai.com/inference/v0/run/82daafa8-4b94-431b-989d-d482e0c29e95/68c18eb3d25e1a930c9ece2a';

        const userId = location.pathname === "/vira" 
          ? `vira_${Date.now()}`
          : `chanak_${Date.now()}`;

        // Call Stack-AI API
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 24aca533-c147-4a96-a309-b59bf6bb9c77'
          },
          body: JSON.stringify({
            "user_id": userId,
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
        appendMessage(chatId!, {
          id: aiMessage.id,
          role: "assistant",
          content: aiMessage.content,
          timestamp: aiMessage.timestamp.toISOString(),
        });
      } catch (error) {
        console.error('Stack-AI API error:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I'm sorry, I encountered an error while processing your request. Please try again.",
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
        appendMessage(chatId!, {
          id: errorMessage.id,
          role: "assistant",
          content: errorMessage.content,
          timestamp: errorMessage.timestamp.toISOString(),
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Simulate AI response for other agents (not integrated with Stack-AI)
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `I'll help you analyze your business idea. Based on your concept, I can provide insights on market potential, competition, target audience, and actionable recommendations. Let me process this information and provide you with a comprehensive ${getModuleInfo().title.toLowerCase()} analysis.`,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        appendMessage(chatId!, {
          id: aiMessage.id,
          role: "assistant",
          content: aiMessage.content,
          timestamp: aiMessage.timestamp.toISOString(),
        });
        setIsLoading(false);
      }, 3000);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Module Pages - Show Messages or Empty State for Input */}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto text-center space-y-8">
            <div className="animate-scale-in">
              <Avatar className="w-24 h-24 border-2 border-border shadow-md">
                <AvatarImage src={moduleInfo.avatar} alt={`${moduleInfo.title} avatar`} />
                <AvatarFallback>{moduleInfo.title[0]}</AvatarFallback>
              </Avatar>
            </div>
            
                  <div className="space-y-3 animate-fade-in text-center">
              <h1 className="text-3xl font-semibold text-foreground">
                {moduleInfo.title}
              </h1>
              <p className="text-base text-text-secondary max-w-2xl">
                {moduleInfo.subtitle}
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-4 animate-fade-in",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-10 h-10 flex-shrink-0 shadow-sm">
                    <AvatarImage src={moduleInfo.avatar} alt={`${moduleInfo.title} avatar`} />
                    <AvatarFallback>{moduleInfo.title[0]}</AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-6 py-4 shadow-sm",
                    message.role === "user"
                      ? "bg-accent/20 border border-border text-foreground ml-12"
                      : "bg-surface border border-border text-card-foreground"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    {message.role === "assistant" && (location.pathname === "/vira" || location.pathname === "/bizzy") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const agentName = location.pathname === "/vira" ? "Vira" : "Bizzy";
                          generateReportPDF(message.content, agentName);
                        }}
                        className="h-6 px-2 text-xs hover:bg-accent/20"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        PDF
                      </Button>
                    )}
                  </div>
                </div>
                
                {message.role === "user" && (
                  <div className="w-10 h-10 bg-secondary/20 border border-border rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
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
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-surface/50 backdrop-blur-sm p-6">
        {(location.pathname === '/artie' || location.pathname === '/mak') ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-3">
                <Avatar className="w-16 h-16 mx-auto border-2 border-border shadow-md">
                  <AvatarImage src={moduleInfo.avatar} alt={`${moduleInfo.title} avatar`} />
                  <AvatarFallback>{moduleInfo.title[0]}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-foreground">Coming Soon</h3>
                <p className="text-text-secondary max-w-md">
                  {location.pathname === '/artie' 
                    ? 'Artie is getting ready to help with your creative designs and branding needs.' 
                    : 'Mak is preparing to assist with your social media automation and content generation.'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your startup or business idea..."
                className="min-h-[60px] max-h-[200px] pr-12 resize-none bg-surface border border-border focus:border-accent/50 placeholder:text-text-muted shadow-sm"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!input.trim() || isLoading}
                className="absolute bottom-3 right-3 h-8 w-8 p-0 bg-accent/20 border border-border hover:bg-accent/30 disabled:opacity-50 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-3 text-xs text-text-muted">
              <span>
                Press Enter to send, Shift + Enter for new line
              </span>
              <span>
                {input.length}/2000
              </span>
            </div>
          </form>
        )}
      </div>

      <LoginModal 
        open={showLogin} 
        onOpenChange={setShowLogin}
        onDemoUser={enableDemoUser}
      />

    </div>
  );
}