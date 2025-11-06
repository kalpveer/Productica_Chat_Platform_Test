import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStartupContext, StartupProfile } from "@/hooks/useStartupContext";
import { toast } from "sonner";

const INDUSTRIES = [
  "Tech",
  "Fintech",
  "EdTech",
  "Health",
  "SaaS",
  "E-commerce",
  "AI/ML",
  "Other",
];

const STAGES = [
  "Idea",
  "Prototype",
  "MVP",
  "Early Traction",
  "Scaling",
];

const BUSINESS_MODELS = [
  "B2B",
  "B2C",
  "Marketplace",
  "Subscription",
  "Freemium",
  "Usage-based",
  "Other",
];

const FUNDING_STATUS = [
  "Bootstrapped",
  "Not Funded",
  "Seed",
  "Pre-Series A",
  "Series A+",
];

export function StartupForm() {
  const { startupProfile, syncStartupProfile } = useStartupContext();
  const [formData, setFormData] = useState<StartupProfile>({
    startupName: "",
    tagline: "",
    industry: "",
    stage: "",
    problem: "",
    targetAudience: "",
    businessModel: "",
    usp: "",
    teamSize: null,
    fundingStatus: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (startupProfile) {
      setFormData(startupProfile);
    }
  }, [startupProfile]);

  const onChange = (key: keyof StartupProfile, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [key]: value as any }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: StartupProfile = {
        ...formData,
      };
      syncStartupProfile(payload);
      toast.success("Startup profile synced successfully with your AI team.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-surface/90 border-border shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-card-foreground">My Startup</CardTitle>
            <CardDescription className="text-text-muted">
              Fill in your startup details. This helps Vira, Bizzy, Artie and Mak tailor responses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startupName" className="text-card-foreground">Startup Name</Label>
                  <Input id="startupName" value={formData.startupName} onChange={e => onChange("startupName", e.target.value)} placeholder="e.g., Productica" className="bg-input border-input-border focus:border-accent/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline" className="text-card-foreground">Tagline / One-liner</Label>
                  <Input id="tagline" value={formData.tagline} onChange={e => onChange("tagline", e.target.value)} placeholder="A short one-liner" className="bg-input border-input-border focus:border-accent/50" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Industry / Domain</Label>
                  <Select value={formData.industry} onValueChange={v => onChange("industry", v)}>
                    <SelectTrigger className="bg-input border-input-border focus:border-accent/50">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] text-neutral-200 shadow-lg rounded-lg border border-border">
                      {INDUSTRIES.map(item => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-card-foreground">Stage of Startup</Label>
                  <Select value={formData.stage} onValueChange={v => onChange("stage", v)}>
                    <SelectTrigger className="bg-input border-input-border focus:border-accent/50">
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] text-neutral-200 shadow-lg rounded-lg border border-border">
                      {STAGES.map(item => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="problem" className="text-card-foreground">Problem You’re Solving</Label>
                <Textarea id="problem" rows={4} value={formData.problem} onChange={e => onChange("problem", e.target.value)} placeholder="Describe the problem" className="bg-input border-input-border focus:border-accent/50 resize-none" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience" className="text-card-foreground">Target Audience</Label>
                <Textarea id="targetAudience" rows={4} value={formData.targetAudience} onChange={e => onChange("targetAudience", e.target.value)} placeholder="Who are you building for?" className="bg-input border-input-border focus:border-accent/50 resize-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Business Model</Label>
                  <Select value={formData.businessModel} onValueChange={v => onChange("businessModel", v)}>
                    <SelectTrigger className="bg-input border-input-border focus:border-accent/50">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] text-neutral-200 shadow-lg rounded-lg border border-border">
                      {BUSINESS_MODELS.map(item => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamSize" className="text-card-foreground">Team Size</Label>
                  <Input id="teamSize" type="number" min={0} value={formData.teamSize ?? ""} onChange={e => onChange("teamSize", e.target.value ? parseInt(e.target.value, 10) : null)} placeholder="0" className="bg-input border-input-border focus:border-accent/50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">Funding Status</Label>
                <Select value={formData.fundingStatus} onValueChange={v => onChange("fundingStatus", v)}>
                  <SelectTrigger className="bg-input border-input-border focus:border-accent/50">
                    <SelectValue placeholder="Select funding status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] text-neutral-200 shadow-lg rounded-lg border border-border">
                    {FUNDING_STATUS.map(item => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="usp" className="text-card-foreground">Key Differentiator / USP</Label>
                <Textarea id="usp" rows={3} value={formData.usp} onChange={e => onChange("usp", e.target.value)} placeholder="What makes you unique?" className="bg-input border-input-border focus:border-accent/50 resize-none" />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary-hover text-primary-foreground">
                  {isSaving ? "Saving..." : "Save & Sync with Agents"}
                </Button>
                <Button variant="outline" onClick={() => history.back()} className="border-border">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default StartupForm;
