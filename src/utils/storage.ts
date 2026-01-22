import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from '../types';
import { migratePetData, validatePetData, repairPetData } from './migration';
import { logger } from './logger';

const PET_STORAGE_BASE_KEY = '@pet_care_game:pet';

const getStorageKey = (userId: string = 'guest') => `${PET_STORAGE_BASE_KEY}:${userId}`;

export const savePet = async (pet: Pet, userId: string = 'guest'): Promise<void> => {
  try {
    // Update lastUpdated timestamp before saving
    const petToSave = {
      ...pet,
      lastUpdated: Date.now(),
    };
    const jsonValue = JSON.stringify(petToSave);
    await AsyncStorage.setItem(getStorageKey(userId), jsonValue);
  } catch (error) {
    logger.error('Erro ao salvar pet:', error);
    throw error;
  }
};

export const loadPet = async (userId: string = 'guest'): Promise<Pet | null> => {
  try {
    // Try to load from user-specific key
    let jsonValue = await AsyncStorage.getItem(getStorageKey(userId));

    // Fallback for backward compatibility: if no user-specific data and we are guest,
    // try to load from the old key (migration path could be added here)
    if (jsonValue == null && userId === 'guest') {
       jsonValue = await AsyncStorage.getItem(PET_STORAGE_BASE_KEY);
       if (jsonValue != null) {
         logger.info('Migrating legacy data to guest user');
         // We found legacy data, we should probably save it to the new key structure
         // But for now just load it.
       }
    }

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
        await savePet(pet);
      }

      return pet;
    }
    return null;
  } catch (error) {
    logger.error('Erro ao carregar pet:', error);
    return null;
  }
};

export const deletePet = async (userId: string = 'guest'): Promise<void> => {
  try {
    await AsyncStorage.removeItem(getStorageKey(userId));
    if (userId === 'guest') {
        // Also try to remove legacy key just in case
        await AsyncStorage.removeItem(PET_STORAGE_BASE_KEY).catch(() => {});
    }
  } catch (error) {
    logger.error('Erro ao deletar pet:', error);
    throw error;
  }
};