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
  const { toast } = useToast();

  const isLoggedIn = !!session;
  const credits = user?.credits || 0;

  const deductCredit = useCallback(async (description: string = "AI Analysis", module?: string) => {
    if (!isLoggedIn) {
      toast({ title: "Login Required", description: "Please login to continue.", duration: 3000 });
      return false;
    }
    const success = await deductCreditsFromUser(1, description, module);
    return success;
  }, [isLoggedIn, deductCreditsFromUser, toast]);

  const addCredits = useCallback(async (amount: number, type: 'purchased' | 'bonus' = 'purchased', description: string = "Credits added") => {
    if (!isLoggedIn) {
      toast({ title: "Login Required", description: "Please login to continue.", duration: 3000 });
      return;
    }
    await addCreditsToUser(amount, type, description);
  }, [isLoggedIn, addCreditsToUser, toast]);

  const showLoginModal = useCallback(() => {
    toast({
      title: "Login Required",
      description: "Please login to use Productica's AI modules",
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
    user,
    loading,
    deductCredit,
    addCredits,
    showLoginModal,
    showOutOfCreditsModal,
    showPurchaseModal,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
  };
}