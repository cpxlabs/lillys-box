import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePet } from '../context/PetContext';
import { useToast } from '../context/ToastContext';
import { hapticFeedback } from '../utils/haptics';
import { PetType, PetColor, Gender } from '../types';
import { BackButtonIcon } from '../hooks/useBackButton';
import { ScreenNavigationProp } from '../types/navigation';
import { validatePetName, sanitizePetName } from '../utils/validation';

type Props = {
  navigation: ScreenNavigationProp<'CreatePet'>;
};

export const CreatePetScreen: React.FC<Props> = ({ navigation }) => {
  const { createPet } = usePet();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [petType, setPetType] = useState<PetType>('cat');
  const [gender, setGender] = useState<Gender>('female');
  const [color, setColor] = useState<PetColor>('base');

  // Reset color when switching pet type if the color is not available for the new type
  const handlePetTypeChange = (newType: PetType) => {
    setPetType(newType);
    // If switching to cat and color is brown or whiteandbrown, reset to base
    if (newType === 'cat' && (color === 'brown' || color === 'whiteandbrown')) {
      setColor('base');
    }
  };

  const handleCreate = async () => {
    const validation = validatePetName(name);

    if (!validation.isValid) {
      showToast(validation.error!, 'error');
      return;
    }

    const sanitizedName = sanitizePetName(name);
    await createPet(sanitizedName, petType, gender, color);
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Menu')}
        accessibilityRole="button"
        accessibilityLabel={t('common.back')}
      >
        <BackButtonIcon />
        <Text style={styles.backButtonText}>{t('common.back')}</Text>
      </TouchableOpacity>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Text style={styles.title}>{t('createPet.title')}</Text>

        <Text style={styles.label}>{t('createPet.choosePet')}</Text>
        <View style={styles.optionRow}>
          <TouchableOpacity
            style={[styles.optionButton, petType === 'cat' && styles.optionSelected]}
            onPress={() => handlePetTypeChange('cat')}
            accessibilityRole="radio"
            accessibilityState={{ selected: petType === 'cat' }}
            accessibilityLabel={t('createPet.cat')}
          >
            <Text style={styles.optionEmoji}>🐱</Text>
            <Text style={styles.optionText}>{t('createPet.cat')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, petType === 'dog' && styles.optionSelected]}
            onPress={() => handlePetTypeChange('dog')}
            accessibilityRole="radio"
            accessibilityState={{ selected: petType === 'dog' }}
            accessibilityLabel={t('createPet.dog')}
          >
            <Text style={styles.optionEmoji}>🐶</Text>
            <Text style={styles.optionText}>{t('createPet.dog')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>{t('createPet.petName')}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder={t('createPet.namePlaceholder')}
            placeholderTextColor="#999"
            maxLength={20}
          />
          <Text
            style={styles.charCount}
            accessibilityLabel={`${name.length} / 20`}
          >
            {name.length}/20
          </Text>
        </View>

        <Text style={styles.label}>{t('createPet.gender')}</Text>
        <View style={styles.optionRow}>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'male' && styles.optionSelected]}
            onPress={() => setGender('male')}
            accessibilityRole="radio"
            accessibilityState={{ selected: gender === 'male' }}
            accessibilityLabel={t('createPet.male')}
          >
            <Text style={styles.genderEmoji}>♂️</Text>
            <Text style={styles.genderText}>{t('createPet.male')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'female' && styles.optionSelected]}
            onPress={() => setGender('female')}
            accessibilityRole="radio"
            accessibilityState={{ selected: gender === 'female' }}
            accessibilityLabel={t('createPet.female')}
          >
            <Text style={styles.genderEmoji}>♀️</Text>
            <Text style={styles.genderText}>{t('createPet.female')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>{t('createPet.coatColor')}</Text>
        <View style={styles.colorContainer}>
          <TouchableOpacity
            style={[styles.colorButton, color === 'base' && styles.optionSelected]}
            onPress={() => setColor('base')}
            accessibilityRole="radio"
            accessibilityState={{ selected: color === 'base' }}
            accessibilityLabel={t('createPet.white')}
          >
            <Text style={styles.colorEmoji}>⚪</Text>
            <Text style={styles.colorText}>{t('createPet.white')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.colorButton, color === 'black' && styles.optionSelected]}
            onPress={() => setColor('black')}
            accessibilityRole="radio"
            accessibilityState={{ selected: color === 'black' }}
            accessibilityLabel={t('createPet.black')}
          >
            <Text style={styles.colorEmoji}>⚫</Text>
            <Text style={styles.colorText}>{t('createPet.black')}</Text>
          </TouchableOpacity>
          {petType === 'dog' && (
            <>
              <TouchableOpacity
                style={[styles.colorButton, color === 'brown' && styles.optionSelected]}
                onPress={() => setColor('brown')}
                accessibilityRole="radio"
                accessibilityState={{ selected: color === 'brown' }}
                accessibilityLabel={t('createPet.brown')}
              >
                <Text style={styles.colorEmoji}>🟤</Text>
                <Text style={styles.colorText}>{t('createPet.brown')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.colorButton, color === 'whiteandbrown' && styles.optionSelected]}
                onPress={() => setColor('whiteandbrown')}
                accessibilityRole="radio"
                accessibilityState={{ selected: color === 'whiteandbrown' }}
                accessibilityLabel={t('createPet.whiteBrown')}
              >
                <Text style={styles.colorEmoji}>🤍🟤</Text>
                <Text style={styles.colorText}>{t('createPet.whiteBrown')}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <TouchableOpacity
          style={[styles.createButton, !name.trim() && styles.createButtonDisabled]}
          onPress={() => {
            if (!name.trim()) {
              hapticFeedback.light();
              showToast(t('createPet.nameRequired'), 'info');
              return;
            }
            handleCreate();
          }}
          activeOpacity={!name.trim() ? 1 : 0.7}
          accessibilityRole="button"
          accessibilityLabel={t('createPet.createButton')}
          accessibilityState={{ disabled: !name.trim() }}
          accessibilityHint={!name.trim() ? t('createPet.nameRequired') : undefined}
        >
          <Text style={styles.createButtonText}>{t('createPet.createButton')}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0ff',
  },
  backButton: {
    padding: 16,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#9b59b6',
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
    marginTop: 16,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minWidth: 120,
    borderWidth: 3,
    borderColor: 'transparent',
    marginHorizontal: 8,
  },
  optionSelected: {
    borderColor: '#9b59b6',
    backgroundColor: '#f3e5f5',
  },
  optionEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  genderButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  genderEmoji: {
    fontSize: 24,
  },
  genderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  colorButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    marginVertical: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorEmoji: {
    fontSize: 24,
  },
  colorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginRight: 4,
  },
  createButton: {
    backgroundColor: '#9b59b6',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 32,
  },
  createButtonDisabled: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});