export const PET_NAME_VALIDATION = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 20,
  ALLOWED_CHARS: /^[a-zA-Z0-9\s\-']+$/,
};

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validatePetName = (name: string): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      error: 'Pet name cannot be empty',
    };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < PET_NAME_VALIDATION.MIN_LENGTH) {
    return {
      isValid: false,
      error: `Pet name must be at least ${PET_NAME_VALIDATION.MIN_LENGTH} character`,
    };
  }

  if (trimmedName.length > PET_NAME_VALIDATION.MAX_LENGTH) {
    return {
      isValid: false,
      error: `Pet name cannot exceed ${PET_NAME_VALIDATION.MAX_LENGTH} characters`,
    };
  }

  if (!PET_NAME_VALIDATION.ALLOWED_CHARS.test(trimmedName)) {
    return {
      isValid: false,
      error: 'Pet name can only contain letters, numbers, spaces, hyphens, and apostrophes',
    };
  }

  return { isValid: true };
};

export const sanitizePetName = (name: string): string => {
  return name.trim().slice(0, PET_NAME_VALIDATION.MAX_LENGTH);
};
