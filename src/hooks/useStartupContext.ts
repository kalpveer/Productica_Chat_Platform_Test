import { create } from 'zustand';

// New profile for the dedicated "My Startup" page
export interface StartupProfile {
  startupName: string;
  tagline: string;
  industry: string;
  stage: string;
  problem: string;
  targetAudience: string;
  businessModel: string;
  usp: string;
  teamSize: number | null;
  fundingStatus: string;
  syncedAt?: string;
}

export interface StartupData {
  fullName: string;
  phoneNumber: string;
  emailId: string;
  startupName: string;
  features: string;
  productStage: string;
  revenue: string;
  isSubmitted: boolean;
  submittedAt?: string;
}

interface StartupStore {
  startupData: StartupData | null;
  startupProfile: StartupProfile | null;
  setStartupData: (data: StartupData) => void;
  clearStartupData: () => void;
  hasStartupData: () => boolean;
  setStartupProfile: (data: StartupProfile) => void;
  clearStartupProfile: () => void;
  hasStartupProfile: () => boolean;
  syncStartupProfile: (data: StartupProfile) => void;
  getContextString: () => string;
  isSubmitted: () => boolean;
}

export const useStartupContext = create<StartupStore>((set, get) => {
  // Initialize from localStorage if available
  let initialProfile: StartupProfile | null = null;
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem('productica.startupProfile') : null;
    if (raw) initialProfile = JSON.parse(raw);
  } catch {
    initialProfile = null;
  }

  return {
    startupData: null,
    startupProfile: initialProfile,

    setStartupData: (data: StartupData) => set({ startupData: data }),

    clearStartupData: () => set({ startupData: null }),

    hasStartupData: () => Boolean(get().startupData),

    setStartupProfile: (data: StartupProfile) => {
      try {
        window.localStorage.setItem('productica.startupProfile', JSON.stringify(data));
      } catch {}
      set({ startupProfile: data });
    },

    clearStartupProfile: () => {
      try {
        window.localStorage.removeItem('productica.startupProfile');
      } catch {}
      set({ startupProfile: null });
    },

    hasStartupProfile: () => Boolean(get().startupProfile),

    syncStartupProfile: (data: StartupProfile) => {
      const payload: StartupProfile = { ...data, syncedAt: new Date().toISOString() };
      try {
        window.localStorage.setItem('productica.startupProfile', JSON.stringify(payload));
      } catch {}
      set({ startupProfile: payload });
    },

    isSubmitted: () => Boolean(get().startupData?.isSubmitted),

    getContextString: () => {
      const data = get().startupData;
      const profile = get().startupProfile;

      const legacy = data
        ? `Name: ${data.fullName}; Email: ${data.emailId}; Phone: ${data.phoneNumber}; Startup: ${data.startupName}; Features: ${data.features}; Stage: ${data.productStage}; Revenue: ${data.revenue}`
        : '';

      const prof = profile
        ? `Startup: ${profile.startupName}; Tagline: ${profile.tagline}; Industry: ${profile.industry}; Stage: ${profile.stage}; Problem: ${profile.problem}; Audience: ${profile.targetAudience}; Model: ${profile.businessModel}; USP: ${profile.usp}; Team: ${profile.teamSize ?? ''}; Funding: ${profile.fundingStatus}`
        : '';

      const parts = [prof, legacy].filter(Boolean).join(' | ');
      return parts ? `[User Startup Context] ${parts}` : '';
    }
  };
});