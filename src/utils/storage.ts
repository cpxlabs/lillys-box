import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from '../types';
import { migratePetData, validatePetData, repairPetData } from './migration';
import { logger } from './logger';

const BASE_PET_STORAGE_KEY = '@pet_care_game:pet';

/**
 * Generate storage key for a specific user
 * Default to 'guest' if no userId provided
 */
const getPetStorageKey = (userId?: string): string => {
  const id = userId || 'guest';
  return `${BASE_PET_STORAGE_KEY}:${id}`;
};

export const savePet = async (pet: Pet, userId?: string): Promise<void> => {
  try {
    // Update lastUpdated timestamp before saving
    const petToSave = {
      ...pet,
      lastUpdated: Date.now(),
    };
    const jsonValue = JSON.stringify(petToSave);
    const storageKey = getPetStorageKey(userId);
    await AsyncStorage.setItem(storageKey, jsonValue);
  } catch (error) {
    logger.error('Erro ao salvar pet:', error);
    throw error;
  }
};

export const loadPet = async (userId?: string): Promise<Pet | null> => {
  try {
    const storageKey = getPetStorageKey(userId);
    const jsonValue = await AsyncStorage.getItem(storageKey);
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
        logger.warn('Pet data validation failed, attempting repair...');
        pet = repairPetData(pet);
        if (!pet) {
          logger.error('Failed to repair pet data');
          return null;
        }
        // Save repaired data
        await savePet(pet, userId);
      }

      return pet;
    }
    return null;
  } catch (error) {
    logger.error('Erro ao carregar pet:', error);
    return null;
  }
};

export const deletePet = async (userId?: string): Promise<void> => {
  try {
    const storageKey = getPetStorageKey(userId);
    await AsyncStorage.removeItem(storageKey);
  } catch (error) {
    logger.error('Erro ao deletar pet:', error);
    throw error;
  }
};
