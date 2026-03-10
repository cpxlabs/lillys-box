import React, { createContext, useContext, useMemo } from 'react';

type GbaRomSummary = {
  id: string;
  title: string;
};

type GbaEmulatorContextType = {
  recentRoms: GbaRomSummary[];
  hasImportedRoms: boolean;
  isImportAvailable: boolean;
};

const GbaEmulatorContext = createContext<GbaEmulatorContextType | undefined>(undefined);

export const GbaEmulatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useMemo<GbaEmulatorContextType>(() => ({
    recentRoms: [],
    hasImportedRoms: false,
    isImportAvailable: false,
  }), []);

  return <GbaEmulatorContext.Provider value={value}>{children}</GbaEmulatorContext.Provider>;
};

export const useGbaEmulator = () => {
  const ctx = useContext(GbaEmulatorContext);
  if (!ctx) throw new Error('useGbaEmulator must be used within GbaEmulatorProvider');
  return ctx;
};
