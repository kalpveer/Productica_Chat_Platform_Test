import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGlobalStore, AgentType } from "@/hooks/useGlobalStore";
import { useShallow } from "zustand/react/shallow";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const AGENTS: { key: AgentType; title: AgentType; avatar: string; description: string; greeting: string; path: string }[] = [
  {
    key: "Vira",
    title: "Vira",
    avatar: "https://i.ibb.co/TB072BQ1/Vira.png",
    description: "Virtual Co-founder",
    greeting: "Hi, I’m Vira — your virtual cofounder. Let’s refine your startup idea together.",
    path: "/vira",
  },
  {
    key: "Bizzy",
    title: "Bizzy",
    avatar: "https://i.ibb.co/xq7CpvL7/Bizzy.png",
    description: "Business Strategist",
    greeting: "Hey there! I’m Bizzy. Ready to dive into your business model and market strategy?",
    path: "/bizzy",
  },
  {
    key: "Artie",
    title: "Artie",
    avatar: "https://i.ibb.co/C5Z5b9Mb/Artie.png",
    description: "Creative Designer",
    greeting: "Hi, I’m Artie. Let’s give your startup an identity that stands out.",
    path: "/artie",
  },
  {
    key: "Mak",
    title: "Mak",
    avatar: "https://i.ibb.co/W4xQfq9D/Mak.jpg",
    description: "Social Media Handler",
    greeting: "Hey! Mak here — I’ll help you make your brand shine on social media.",
    path: "/mak",
  },
];

export function NewChatModal() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isNewChatOpen, closeNewChat, addChat, setActiveChat } = useGlobalStore(useShallow((s) => ({
    isNewChatOpen: s.isNewChatOpen,
    closeNewChat: s.closeNewChat,
    addChat: s.addChat,
    setActiveChat: s.setActiveChat,
  })));

  const handleSelect = (agentKey: AgentType) => {
    const agent = AGENTS.find((a) => a.key === agentKey)!;
    const chatId = addChat(agentKey, agent.greeting);
    setActiveChat(chatId);
    navigate(agent.path);
    toast({ title: "New chat created", description: `${agent.title} is ready to help.` });
    closeNewChat();
  };

  return (
    <Dialog open={isNewChatOpen} onOpenChange={(v) => (!v ? closeNewChat() : undefined)}>
      <DialogContent className="sm:max-w-lg bg-card border border-border rounded-2xl" aria-label="Start a new chat">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Start a New Chat</DialogTitle>
          <DialogDescription className="text-text-muted">
            Choose an agent to begin. A greeting will appear automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {AGENTS.map((agent) => (
            <motion.button
              key={agent.key}
              onClick={() => handleSelect(agent.key)}
              className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-sidebar-hover text-left"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              aria-label={`Start chat with ${agent.title}`}
            >
              <Avatar className="w-9 h-9">
                <AvatarImage src={agent.avatar} alt={`${agent.title} avatar`} />
                <AvatarFallback>{agent.title[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-card-foreground">{agent.title}</div>
                <div className="text-xs text-muted-foreground truncate">{agent.description}</div>
              </div>
            </motion.button>
          ))}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={closeNewChat} className="rounded-xl">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewChatModal;
