import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useGameBestScore } from '../hooks/useGameBestScore';

const STORAGE_KEY_BASE = '@pet_dance_party:bestScore';

interface PetDancePartyContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const PetDancePartyContext = createContext<PetDancePartyContextType | undefined>(undefined);

export const PetDancePartyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? 'guest';
  const [bestScore, updateBestScore] = useGameBestScore(`${STORAGE_KEY_BASE}:${userId}`);

  return (
    <PetDancePartyContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </PetDancePartyContext.Provider>
  );
};

export const usePetDanceParty = () => {
  const ctx = useContext(PetDancePartyContext);
  if (!ctx) throw new Error('usePetDanceParty must be used within PetDancePartyProvider');
  return ctx;
};
