import { useState } from "react";
import { LogIn, UserPlus, Coins, Plus, LogOut, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCreditSystem } from "@/hooks/useCreditSystem";
import { LoginModal } from "@/components/LoginModal";
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
    showLoginModal,
    enableDemoUser
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
                <LoginModal open={showAuth} onOpenChange={setShowAuth} onDemoUser={enableDemoUser} />
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