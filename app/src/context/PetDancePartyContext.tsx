import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface PetDancePartyContextType { bestScore: number; updateBestScore: (score: number) => void; }
const PetDancePartyContext = createContext<PetDancePartyContextType | undefined>(undefined);

export const PetDancePartyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@pet_dance_party:bestScore');
  return <PetDancePartyContext.Provider value={{ bestScore, updateBestScore }}>{children}</PetDancePartyContext.Provider>;
};

export const usePetDanceParty = () => {
  const ctx = useContext(PetDancePartyContext);
  if (!ctx) throw new Error('usePetDanceParty must be used within PetDancePartyProvider');
  return ctx;
};
