import { useState } from "react";
import { LogIn, UserPlus, Coins, Plus, LogOut, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCreditSystem } from "@/hooks/useCreditSystem";
import { CreditHistoryModal } from "@/components/CreditHistoryModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate, useLocation } from "react-router-dom";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import { useShallow } from "zustand/react/shallow";

// Helper function to open help contact
const openHelpContact = () => {
  const helpButton = document.querySelector('[data-help-button]') as HTMLButtonElement;
  if (helpButton) {
    helpButton.click();
    setTimeout(() => {
      const contactTab = document.querySelector('[data-contact-tab]') as HTMLButtonElement;
      if (contactTab) {
        contactTab.click();
      }
    }, 100);
  }
};

export function TopBar() {
  const {
    credits,
    isLoggedIn,
    user,
    loading,
    signInWithGoogle,
    signOut,
    showLoginModal
  } = useCreditSystem();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showCreditHistory, setShowCreditHistory] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { openSearch, openNewChat, openSettings } = useGlobalStore(useShallow((s) => ({
    openSearch: s.openSearch,
    openNewChat: s.openNewChat,
    openSettings: s.openSettings,
  })));
  
  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    setShowAuth(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };
  return <header className="h-14 sm:h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-3 sm:px-4 lg:px-6">
        {/* Left: Sidebar Trigger */}
        <div className="flex items-center">
          <SidebarTrigger className="text-text-secondary hover:text-foreground" />
        </div>

        {/* Right: Theme Toggle, Credits and Auth */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Credits Display */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Badge variant="outline" onClick={() => setShowCreditHistory(true)} className="cursor-pointer text-xs sm:text-sm px-2 py-1 bg-gray-700 text-neutral-100 hover:bg-gray-600 border border-gray-600 rounded-md">
              <Coins className="w-3 h-3 mr-1" />
              <span className="hidden xs:inline">{credits} credits</span>
              <span className="xs:hidden">{credits}</span>
            </Badge>
            <Button size="sm" onClick={openHelpContact} className="h-8 px-2 sm:px-3 bg-primary hover:bg-primary/90 text-xs sm:text-sm">
              <Plus className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">Get More</span>
            </Button>
            {credits <= 2 && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {!isLoggedIn ? (
              <Dialog open={showAuth} onOpenChange={setShowAuth}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm" className="bg-secondary hover:bg-secondary-hover h-8 px-2 sm:px-3 text-xs sm:text-sm">
                    <LogIn className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="sm:max-w-md bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="text-card-foreground">
                      Welcome to Productica
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                      Sign in with Google to get 5 free credits and access all features
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <Button 
                      onClick={handleGoogleSignIn}
                      className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                      disabled={loading}
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      {loading ? "Signing in..." : "Sign in with Google"}
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-sm text-text-muted">
                        By signing in, you agree to our Terms of Service and Privacy Policy
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar_url} alt={user?.full_name || "User"} />
                      <AvatarFallback>
                        {user?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.full_name || "User"}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          <CreditHistoryModal open={showCreditHistory} onOpenChange={setShowCreditHistory} />
        </div>
      </div>
    </header>;
}