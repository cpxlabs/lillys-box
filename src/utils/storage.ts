import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from '../types';
import { migratePetData, validatePetData, repairPetData } from './migration';

const PET_STORAGE_KEY = '@pet_care_game:pet';

export const savePet = async (pet: Pet): Promise<void> => {
  try {
    // Update lastUpdated timestamp before saving
    const petToSave = {
      ...pet,
      lastUpdated: Date.now(),
    };
    const jsonValue = JSON.stringify(petToSave);
    await AsyncStorage.setItem(PET_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Erro ao salvar pet:', error);
    throw error;
  }
};

export const loadPet = async (): Promise<Pet | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(PET_STORAGE_KEY);
    if (jsonValue != null) {
      let pet = JSON.parse(jsonValue);

      // Legacy migrations (kept for backwards compatibility)
      if (!pet.color) {
        pet.color = 'base';
      }
      if (pet.money === undefined) {
        pet.money = 0;
      }

      // Apply new migration system
      pet = migratePetData(pet);

      // Validate migrated data
      if (!validatePetData(pet)) {
        console.warn('Pet data validation failed, attempting repair...');
        pet = repairPetData(pet);
        if (!pet) {
          console.error('Failed to repair pet data');
          return null;
        }
        // Save repaired data
        await savePet(pet);
      }

      return pet;
    }
    return null;
  } catch (error) {
    console.error('Erro ao carregar pet:', error);
    return null;
  }
};

export const deletePet = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PET_STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao deletar pet:', error);
    throw error;
  }
};