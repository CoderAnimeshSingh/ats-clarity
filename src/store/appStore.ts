import { create } from 'zustand';
import type { UserSettings } from '@/types/resume';

interface AppState {
  isPro: boolean;
  licenseKey: string | null;
  isLoading: boolean;
  
  // Actions
  setIsPro: (isPro: boolean) => void;
  setLicenseKey: (key: string | null) => void;
  activateLicense: (key: string) => boolean;
  setLoading: (loading: boolean) => void;
}

// Simple license validation (demo purposes)
const VALID_LICENSE_PREFIXES = ['PRO-', 'RESUME-', 'ATS-'];

export const useAppStore = create<AppState>((set) => ({
  isPro: localStorage.getItem('isPro') === 'true',
  licenseKey: localStorage.getItem('licenseKey'),
  isLoading: false,

  setIsPro: (isPro) => {
    localStorage.setItem('isPro', String(isPro));
    set({ isPro });
  },

  setLicenseKey: (key) => {
    if (key) {
      localStorage.setItem('licenseKey', key);
    } else {
      localStorage.removeItem('licenseKey');
    }
    set({ licenseKey: key });
  },

  activateLicense: (key) => {
    const isValid = VALID_LICENSE_PREFIXES.some(prefix => 
      key.toUpperCase().startsWith(prefix) && key.length >= 12
    );
    
    if (isValid) {
      localStorage.setItem('isPro', 'true');
      localStorage.setItem('licenseKey', key);
      set({ isPro: true, licenseKey: key });
      return true;
    }
    return false;
  },

  setLoading: (loading) => set({ isLoading: loading }),
}));
