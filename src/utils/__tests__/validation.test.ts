import { validatePetName, sanitizePetName, PET_NAME_VALIDATION } from '../validation';

describe('validation', () => {
  describe('validatePetName', () => {
    it('should accept valid names', () => {
      expect(validatePetName('Fluffy').isValid).toBe(true);
      expect(validatePetName('Mr Whiskers').isValid).toBe(true);
      expect(validatePetName("O'Malley").isValid).toBe(true);
      expect(validatePetName('Rex-5').isValid).toBe(true);
      expect(validatePetName('Tom123').isValid).toBe(true);
    });

    it('should reject empty names', () => {
      const result1 = validatePetName('');
      expect(result1.isValid).toBe(false);
      expect(result1.error).toBe('Pet name cannot be empty');

      const result2 = validatePetName('   ');
      expect(result2.isValid).toBe(false);
      expect(result2.error).toBe('Pet name cannot be empty');
    });

    it('should reject names that are too long', () => {
      const longName = 'a'.repeat(PET_NAME_VALIDATION.MAX_LENGTH + 1);
      const result = validatePetName(longName);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('cannot exceed');
    });

    it('should reject names with invalid characters', () => {
      const result1 = validatePetName('Fluffy😀');
      expect(result1.isValid).toBe(false);
      expect(result1.error).toContain('can only contain');

      const result2 = validatePetName('Pet<script>');
      expect(result2.isValid).toBe(false);

      const result3 = validatePetName('Name@#$');
      expect(result3.isValid).toBe(false);

      const result4 = validatePetName('Pet.Name');
      expect(result4.isValid).toBe(false);
    });

    it('should accept names with allowed special characters', () => {
      expect(validatePetName("O'Malley").isValid).toBe(true);
      expect(validatePetName('Max-Well').isValid).toBe(true);
      expect(validatePetName('Mr Fluffy').isValid).toBe(true);
    });

    it('should handle edge cases', () => {
      // Exactly at max length
      const maxName = 'a'.repeat(PET_NAME_VALIDATION.MAX_LENGTH);
      expect(validatePetName(maxName).isValid).toBe(true);

      // One character
      expect(validatePetName('A').isValid).toBe(true);

      // Name with multiple spaces
      expect(validatePetName('Max  Well').isValid).toBe(true);
    });
  });

  describe('sanitizePetName', () => {
    it('should trim whitespace', () => {
      expect(sanitizePetName('  Fluffy  ')).toBe('Fluffy');
      expect(sanitizePetName('\tMax\n')).toBe('Max');
    });

    it('should truncate long names', () => {
      const longName = 'a'.repeat(PET_NAME_VALIDATION.MAX_LENGTH + 10);
      const sanitized = sanitizePetName(longName);
      expect(sanitized.length).toBe(PET_NAME_VALIDATION.MAX_LENGTH);
    });

    it('should handle normal names correctly', () => {
      expect(sanitizePetName('Fluffy')).toBe('Fluffy');
      expect(sanitizePetName('Mr Whiskers')).toBe('Mr Whiskers');
    });

    it('should trim and truncate together', () => {
      const longNameWithSpaces = '  ' + 'a'.repeat(PET_NAME_VALIDATION.MAX_LENGTH + 5) + '  ';
      const sanitized = sanitizePetName(longNameWithSpaces);
      expect(sanitized.length).toBe(PET_NAME_VALIDATION.MAX_LENGTH);
    });
  });
});
