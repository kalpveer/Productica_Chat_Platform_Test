import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Lock } from "lucide-react";
import { useCreditSystem } from "@/hooks/useCreditSystem";
interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDemoUser: () => void;
}
export function LoginModal({
  open,
  onOpenChange,
  onDemoUser
}: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signInWithEmail, signUpWithEmail } = useCreditSystem();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name || undefined);
      } else {
        await signInWithEmail(email, password);
      }
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };
  const handleDemoUser = () => {
    onDemoUser();
    onOpenChange(false);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[hsl(var(--modal-background))] border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center text-foreground">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && <div className="space-y-2">
                <Label htmlFor="name" className="text-text-secondary">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
                  <Input id="name" type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} className="pl-10 bg-input border-input-border focus:border-accent" />
                </div>
              </div>}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-text-secondary">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
                <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10 bg-input border-input-border focus:border-accent" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-text-secondary">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
                <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 bg-input border-input-border focus:border-accent" />
              </div>
            </div>
            
            <Button type="submit" disabled={submitting} className="w-full bg-accent text-accent-foreground hover:bg-accent-hover">
              {submitting ? (isSignUp ? "Creating..." : "Signing in...") : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
          </form>
          
          <div className="relative">
            <Separator className="bg-border" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[hsl(var(--modal-background))] px-2 text-xs text-text-muted">
              OR
            </span>
          </div>
          
          <Button variant="outline" onClick={handleDemoUser} className="w-full border-input-border hover:border-accent text-text-primary bg-surface hover:bg-surface-hover">
            Continue as Demo User
          </Button>
          
          <div className="text-center">
            <Button variant="ghost" onClick={() => setIsSignUp(!isSignUp)} className="text-zinc-100">
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
}