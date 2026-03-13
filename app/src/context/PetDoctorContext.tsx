import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface PetDoctorContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const PetDoctorContext = createContext<PetDoctorContextType | null>(null);

export const PetDoctorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@game_pet-doctor_best_score');
  return (
    <PetDoctorContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </PetDoctorContext.Provider>
  );
};

export const usePetDoctor = () => {
  const ctx = useContext(PetDoctorContext);
  if (!ctx) throw new Error('usePetDoctor must be used within PetDoctorProvider');
  return ctx;
};
