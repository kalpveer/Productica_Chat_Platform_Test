import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import { useShallow } from "zustand/react/shallow";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export function SettingsModal() {
  const { isSettingsOpen, closeSettings, preferences, setPreferences } = useGlobalStore(useShallow((s) => ({
    isSettingsOpen: s.isSettingsOpen,
    closeSettings: s.closeSettings,
    preferences: s.preferences,
    setPreferences: s.setPreferences,
  })));
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [local, setLocal] = useState(preferences);

  useEffect(() => {
    setLocal(preferences);
  }, [preferences]);

  const handleSave = () => {
    setPreferences(local);
    setTheme(local.theme);
    toast({ title: "Preferences saved", description: "Your settings have been updated." });
    closeSettings();
  };

  return (
    <Dialog open={isSettingsOpen} onOpenChange={(v) => (!v ? closeSettings() : undefined)}>
      <DialogContent className="sm:max-w-2xl bg-card border border-border rounded-2xl" aria-label="Settings">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Settings</DialogTitle>
          <DialogDescription className="text-text-muted">Customize your Productica experience.</DialogDescription>
        </DialogHeader>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Theme */}
          <section className="space-y-3">
            <Label className="text-sm">Theme Preferences</Label>
            <div className="flex gap-2">
              {(["light", "dark", "system"] as const).map((t) => (
                <Button
                  key={t}
                  variant={local.theme === t ? "default" : "secondary"}
                  onClick={() => setLocal((s) => ({ ...s, theme: t }))}
                  className="rounded-xl"
                  aria-label={`Set theme ${t}`}
                >
                  {t[0].toUpperCase() + t.slice(1)}
                </Button>
              ))}
            </div>
          </section>

          {/* Agent Behavior */}
          <section className="space-y-3">
            <Label className="text-sm">Agent Behavior</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.entries(local.agentBehavior).map(([agent, value]) => (
                <div key={agent} className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{agent}</span>
                    <span>{Math.round(value * 100)}%</span>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={([v]) =>
                      setLocal((s) => ({ ...s, agentBehavior: { ...s.agentBehavior, [agent]: v } }))
                    }
                    min={0}
                    max={1}
                    step={0.01}
                    aria-label={`Adjust behavior for ${agent}`}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Professional / Analytical</span>
                    <span>Friendly / Conversational</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Notifications */}
          <section className="space-y-3">
            <Label className="text-sm">Notifications</Label>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="text-sm">Enable toast notifications</span>
              <Switch
                checked={local.notificationsEnabled}
                onCheckedChange={(v) => setLocal((s) => ({ ...s, notificationsEnabled: !!v }))}
                aria-label="Toggle toast notifications"
              />
            </div>
          </section>

          {/* Language */}
          <section className="space-y-3">
            <Label className="text-sm">Language / Region</Label>
            <Select value={local.language} onValueChange={(v) => setLocal((s) => ({ ...s, language: v }))}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="en-GB">English (UK)</SelectItem>
                <SelectItem value="hi-IN">Hindi (IN)</SelectItem>
                <SelectItem value="es-ES">Spanish (ES)</SelectItem>
              </SelectContent>
            </Select>
          </section>
        </motion.div>

        <DialogFooter>
          <Button variant="secondary" onClick={closeSettings} className="rounded-xl">
            Cancel
          </Button>
          <Button onClick={handleSave} className="rounded-xl">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsModal;
