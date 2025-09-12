import { create } from 'zustand';
import { ScriptType, ThemeType, SearchFilters } from '@/types/database';

interface AppStore {
  // Theme & Settings
  theme: ThemeType;
  scriptType: ScriptType;
  language: 'en' | 'hi';
  fontSize: number;
  
  // Search & Filters
  searchQuery: string;
  filters: SearchFilters;
  
  // UI State
  isFilterModalOpen: boolean;
  
  // Actions
  setTheme: (theme: ThemeType) => void;
  setScriptType: (type: ScriptType) => void;
  setLanguage: (lang: 'en' | 'hi') => void;
  setFontSize: (size: number) => void;
  
  // Search Actions
  setSearchQuery: (query: string) => void;
  setFilters: (filters: SearchFilters) => void;
  
  // UI Actions
  setFilterModalOpen: (open: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // Initial state
  theme: 'system',
  scriptType: 'devanagari',
  language: 'en',
  fontSize: 16,
  
  searchQuery: '',
  filters: {
    categories: [],
    composers: [],
    tags: [],
    hasAudio: null,
    raga: undefined,
    tala: undefined,
  },
  
  isFilterModalOpen: false,
  
  // Actions
  setTheme: (theme) => set({ theme }),
  setScriptType: (scriptType) => set({ scriptType }),
  setLanguage: (language) => set({ language }),
  setFontSize: (fontSize) => set({ fontSize }),
  
  // Search Actions
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilters: (filters) => set({ filters }),
  
  // UI Actions
  setFilterModalOpen: (isFilterModalOpen) => set({ isFilterModalOpen }),
}));