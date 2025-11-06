import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Building2, Lightbulb } from "lucide-react";
import { useGlobalStore, AgentType } from "@/hooks/useGlobalStore";
import { useShallow } from "zustand/react/shallow";
import { useStartupContext } from "@/hooks/useStartupContext";

interface SearchResultBase {
  id: string;
  type: "chat" | "profile" | "insight";
  title: string;
  subtitle?: string;
  agent?: AgentType;
}

function agentPath(agent: AgentType): string {
  switch (agent) {
    case "Vira":
      return "/vira";
    case "Bizzy":
      return "/bizzy";
    case "Artie":
      return "/artie";
    case "Mak":
      return "/mak";
  }
}

function normalize(text: string) {
  return text.toLowerCase();
}

function fuzzyScore(text: string, query: string): number {
  // Very lightweight fuzzy score: includes + ordered char match
  const t = normalize(text);
  const q = normalize(query);
  if (!q) return 0;
  if (t.includes(q)) return q.length * 3;
  // ordered char match
  let ti = 0;
  let score = 0;
  for (let qi = 0; qi < q.length; qi++) {
    const ch = q[qi];
    const found = t.indexOf(ch, ti);
    if (found === -1) return 0;
    // closer matches get slightly better score
    score += 1 + Math.max(0, 3 - (found - ti));
    ti = found + 1;
  }
  return score;
}

export function SearchOverlay() {
  const navigate = useNavigate();
  const { isSearchOpen, closeSearch, chats, setActiveChat } = useGlobalStore(useShallow((s) => ({
    isSearchOpen: s.isSearchOpen,
    closeSearch: s.closeSearch,
    chats: s.chats,
    setActiveChat: s.setActiveChat,
  })));
  const { startupProfile } = useStartupContext();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "chats" | "profiles" | "insights">("all");

  // Build index
  const { chatResults, profileResults, insightResults } = useMemo(() => {
    const safeChats = Array.isArray(chats) ? chats : [];
    const chatResults = safeChats.map((c) => ({
      id: c.id,
      type: "chat" as const,
      title: c.title,
      subtitle: c.snippet || c.messages[c.messages.length - 1]?.content || "",
      agent: c.agent,
    }));

    const profileResults: SearchResultBase[] = startupProfile
      ? [
          {
            id: "profile",
            type: "profile",
            title: startupProfile.startupName,
            subtitle: startupProfile.tagline,
          },
        ]
      : [];

    const insightSeeds: string[] = [];
    if (startupProfile) {
      const { usp, problem, targetAudience, industry, stage } = startupProfile;
      [usp, problem, targetAudience, industry, stage]
        .filter(Boolean)
        .forEach((t) => t && insightSeeds.push(String(t)));
    }

    const insightResults: SearchResultBase[] = insightSeeds.map((t, i) => ({
      id: `insight_${i}`,
      type: "insight",
      title: t,
      subtitle: "Insight from your startup context",
    }));

    return { chatResults, profileResults, insightResults };
  }, [chats, startupProfile]);

  const allResults = useMemo(() => {
    const list: SearchResultBase[] = [];
    if (filter === "all" || filter === "chats") list.push(...chatResults);
    if (filter === "all" || filter === "profiles") list.push(...profileResults);
    if (filter === "all" || filter === "insights") list.push(...insightResults);

    if (!query.trim()) return list;

    return list
      .map((r) => ({ r, s: fuzzyScore(`${r.title} ${r.subtitle ?? ""}`, query) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.r);
  }, [query, filter, chatResults, profileResults, insightResults]);

  const handleSelect = (res: SearchResultBase) => {
    if (res.type === "chat" && res.agent) {
      setActiveChat(res.id);
      navigate(agentPath(res.agent));
      closeSearch();
      return;
    }
    if (res.type === "profile") {
      navigate("/my-startup");
      closeSearch();
      return;
    }
    if (res.type === "insight") {
      // Route insights to Vira for now
      navigate("/vira");
      closeSearch();
    }
  };

  // Global shortcut: Cmd/Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (!isSearchOpen) {
          // open is driven externally; emitting a custom event isn't necessary since sidebar triggers it
          // For now, do nothing. Consumers open via state.
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isSearchOpen]);

  return (
    <CommandDialog open={isSearchOpen} onOpenChange={(v) => (!v ? closeSearch() : undefined)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <CommandInput
          autoFocus
          placeholder="Search conversations, startup ideas, or agent insights…"
          value={query}
          onValueChange={setQuery as any}
          aria-label="Search Productica"
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <AnimatePresence initial={false}>
            {(filter === "all" || filter === "chats") && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CommandGroup heading="Recent Chats">
                  {allResults
                    .filter((r) => r.type === "chat")
                    .map((r) => (
                      <CommandItem key={r.id} onSelect={() => handleSelect(r)} aria-label={`Open chat ${r.title}`}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <div className="flex flex-col">
                          <span className="text-sm">{r.title}</span>
                          {r.subtitle && (
                            <span className="text-xs text-muted-foreground line-clamp-1">{r.subtitle}</span>
                          )}
                        </div>
                        {r.agent && (
                          <Badge variant="outline" className="ml-auto text-[10px]">
                            {r.agent}
                          </Badge>
                        )}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </motion.div>
            )}

            {(filter === "all" || filter === "profiles") && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CommandGroup heading="Startup Profiles">
                  {allResults
                    .filter((r) => r.type === "profile")
                    .map((r) => (
                      <CommandItem key={r.id} onSelect={() => handleSelect(r)} aria-label={`Open profile ${r.title}`}>
                        <Building2 className="mr-2 h-4 w-4" />
                        <div className="flex flex-col">
                          <span className="text-sm">{r.title}</span>
                          {r.subtitle && (
                            <span className="text-xs text-muted-foreground line-clamp-1">{r.subtitle}</span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
              </motion.div>
            )}

            {(filter === "all" || filter === "insights") && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CommandGroup heading="Insights">
                  {allResults
                    .filter((r) => r.type === "insight")
                    .map((r) => (
                      <CommandItem key={r.id} onSelect={() => handleSelect(r)} aria-label={`Open insight ${r.title}`}>
                        <Lightbulb className="mr-2 h-4 w-4" />
                        <div className="flex flex-col">
                          <span className="text-sm">{r.title}</span>
                          {r.subtitle && (
                            <span className="text-xs text-muted-foreground line-clamp-1">{r.subtitle}</span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
              </motion.div>
            )}
          </AnimatePresence>
        </CommandList>
      </motion.div>
    </CommandDialog>
  );
}

export default SearchOverlay;
