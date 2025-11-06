import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Helper function to scroll to and open help contact
const openHelpContact = () => {
  // Find the help button and trigger it
  const helpButton = document.querySelector('[data-help-button]') as HTMLButtonElement;
  if (helpButton) {
    helpButton.click();
    // Set a timeout to switch to contact tab
    setTimeout(() => {
      const contactTab = document.querySelector('[data-contact-tab]') as HTMLButtonElement;
      if (contactTab) {
        contactTab.click();
      }
    }, 100);
  }
};

export function useCreditSystem() {
  const { user, session, loading, signUpWithEmail, signInWithEmail, signInWithGoogle: authSignInWithGoogle, signOut: authSignOut, addCredits: addCreditsToUser, deductCredits: deductCreditsFromUser } = useAuth();
  
  // Demo user state for non-authenticated users
  const [isDemoUser, setIsDemoUser] = useState(() => {
    return localStorage.getItem("productica_demo_user") === "true";
  });
  const [demoCredits, setDemoCredits] = useState(() => {
    const saved = localStorage.getItem("productica_demo_credits");
    return saved ? parseInt(saved) : (isDemoUser ? 5 : 0);
  });
  
  const { toast } = useToast();

  // Use Supabase user data if authenticated, otherwise use demo data
  const isLoggedIn = !!session;
  const credits = isLoggedIn ? (user?.credits || 0) : demoCredits;

  const deductCredit = useCallback(async (description: string = "AI Analysis", module?: string) => {
    if (isLoggedIn) {
      // Use Supabase for authenticated users
      const success = await deductCreditsFromUser(1, description, module);
      return success;
    } else {
      // Use local storage for demo users
      if (demoCredits > 0) {
        const newCredits = demoCredits - 1;
        setDemoCredits(newCredits);
        localStorage.setItem("productica_demo_credits", newCredits.toString());
        
        toast({
          title: "Credit Used",
          description: `${newCredits} credits remaining`,
          duration: 2000,
        });
        return true;
      }
      return false;
    }
  }, [isLoggedIn, demoCredits, deductCreditsFromUser, toast]);

  const addCredits = useCallback(async (amount: number, type: 'purchased' | 'bonus' = 'purchased', description: string = "Credits added") => {
    if (isLoggedIn) {
      // Use Supabase for authenticated users
      await addCreditsToUser(amount, type, description);
    } else {
      // Use local storage for demo users
      const newCredits = demoCredits + amount;
      setDemoCredits(newCredits);
      localStorage.setItem("productica_demo_credits", newCredits.toString());
      
      toast({
        title: "Credits Added!",
        description: `${amount} credits added. Total: ${newCredits}`,
        duration: 3000,
      });
    }
  }, [isLoggedIn, demoCredits, addCreditsToUser, toast]);

  const enableDemoUser = useCallback(() => {
    setIsDemoUser(true);
    const demoCredits = 5;
    setDemoCredits(demoCredits);
    localStorage.setItem("productica_demo_user", "true");
    localStorage.setItem("productica_demo_credits", demoCredits.toString());
    
    toast({
      title: "Demo Mode Activated",
      description: "You have 5 free credits to explore Productica",
      duration: 3000,
    });
  }, [toast]);

  const showLoginModal = useCallback(() => {
    toast({
      title: "Login Required",
      description: "Please login to use Productica's AI modules or continue as demo user",
      duration: 3000,
    });
  }, [toast]);

  const signInWithGoogle = useCallback(async () => {
    await authSignInWithGoogle();
  }, [authSignInWithGoogle]);

  const signOut = useCallback(async () => {
    await authSignOut();
  }, [authSignOut]);

  const showOutOfCreditsModal = useCallback(() => {
    toast({
      title: "Out of Credits",
      description: "Redirecting you to support for credit assistance...",
      duration: 2000,
    });
    
    // Open help contact interface after a short delay
    setTimeout(() => {
      openHelpContact();
    }, 1000);
  }, [toast]);

  const showPurchaseModal = useCallback(() => {
    toast({
      title: "Purchase Credits",
      description: "Choose a credit package to continue using Productica",
      duration: 3000,
    });
  }, [toast]);

  return {
    credits,
    isLoggedIn,
    isDemoUser,
    user,
    loading,
    deductCredit,
    addCredits,
    enableDemoUser,
    showLoginModal,
    showOutOfCreditsModal,
    showPurchaseModal,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
  };
}