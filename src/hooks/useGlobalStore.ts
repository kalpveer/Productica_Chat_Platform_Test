import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AgentType = "Vira" | "Bizzy" | "Artie" | "Mak";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string; // ISO string
}

export interface ChatSession {
  id: string;
  agent: AgentType;
  title: string;
  snippet?: string;
  createdAt: string; // ISO
  messages: ChatMessage[];
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  agentBehavior: Record<AgentType, number>; // 0..1
  notificationsEnabled: boolean;
  language: string; // e.g., "en-US"
}

interface GlobalStore {
  // UI state
  isSearchOpen: boolean;
  isNewChatOpen: boolean;
  isSettingsOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  openNewChat: () => void;
  closeNewChat: () => void;
  openSettings: () => void;
  closeSettings: () => void;

  // Chats
  chats: ChatSession[];
  activeChatId: string | null;
  addChat: (agent: AgentType, greeting: string) => string; // returns id
  setActiveChat: (chatId: string | null) => void;
  appendMessage: (chatId: string, message: ChatMessage) => void;
  updateChatSnippet: (chatId: string, snippet: string) => void;
  removeChat: (chatId: string) => void;

  // Analytics
  agentUsage: Record<AgentType, number>;
  incrementAgentUsage: (agent: AgentType) => void;

  // Preferences
  preferences: UserPreferences;
  setPreferences: (partial: Partial<UserPreferences>) => void;
}

const generateId = () => `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const defaultPreferences: UserPreferences = {
  theme: "dark",
  agentBehavior: {
    Vira: 0.5,
    Bizzy: 0.5,
    Artie: 0.5,
    Mak: 0.5,
  },
  notificationsEnabled: true,
  language: "en-US",
};

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set, get) => ({
      // UI state
      isSearchOpen: false,
      isNewChatOpen: false,
      isSettingsOpen: false,
      openSearch: () => set({ isSearchOpen: true }),
      closeSearch: () => set({ isSearchOpen: false }),
      openNewChat: () => set({ isNewChatOpen: true }),
      closeNewChat: () => set({ isNewChatOpen: false }),
      openSettings: () => set({ isSettingsOpen: true }),
      closeSettings: () => set({ isSettingsOpen: false }),

      // Chats
      chats: [],
      activeChatId: null,
      addChat: (agent, greeting) => {
        const id = generateId();
        const createdAt = new Date().toISOString();
        const initialMessage: ChatMessage = {
          id: `${Date.now()}_assistant`,
          role: "assistant",
          content: greeting,
          timestamp: createdAt,
        };
        const title = `${agent} • New Chat`;
        const newChat: ChatSession = {
          id,
          agent,
          title,
          snippet: greeting.slice(0, 100),
          createdAt,
          messages: [initialMessage],
        };
        set((state) => ({
          chats: [newChat, ...state.chats],
          activeChatId: id,
        }));
        return id;
      },
      setActiveChat: (chatId) => set({ activeChatId: chatId }),
      appendMessage: (chatId, message) => {
        set((state) => ({
          chats: state.chats.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  messages: [...c.messages, message],
                  snippet:
                    message.role === "assistant"
                      ? message.content.slice(0, 100)
                      : c.snippet,
                }
              : c
          ),
        }));
      },
      updateChatSnippet: (chatId, snippet) => {
        set((state) => ({
          chats: state.chats.map((c) => (c.id === chatId ? { ...c, snippet } : c)),
        }));
      },
      removeChat: (chatId) => {
        set((state) => ({
          chats: state.chats.filter((c) => c.id !== chatId),
          activeChatId: state.activeChatId === chatId ? null : state.activeChatId,
        }));
      },

      // Analytics
      agentUsage: { Vira: 0, Bizzy: 0, Artie: 0, Mak: 0 },
      incrementAgentUsage: (agent) =>
        set((state) => ({ agentUsage: { ...state.agentUsage, [agent]: (state.agentUsage[agent] || 0) + 1 } })),

      // Preferences
      preferences: defaultPreferences,
      setPreferences: (partial) =>
        set((state) => ({ preferences: { ...state.preferences, ...partial } })),
    }),
    {
      name: "productica-global-store",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        chats: Array.isArray(state.chats) ? state.chats : [],
        activeChatId: state.activeChatId,
        preferences: state.preferences,
        agentUsage: state.agentUsage,
      }),
    }
  )
);
