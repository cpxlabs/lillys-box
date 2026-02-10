import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { EmojiIcon } from '../components/EmojiIcon';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { usePet } from '../context/PetContext';
import { useToast } from '../context/ToastContext';
import { hapticFeedback } from '../utils/haptics';
import { PetType, PetColor, Gender } from '../types';
import { BackButtonIcon } from '../hooks/useBackButton';
import { ScreenNavigationProp } from '../types/navigation';
import { validatePetName, sanitizePetName } from '../utils/validation';
import { COLORS } from '../config/constants';

type Props = {
  navigation: ScreenNavigationProp<'CreatePet'>;
};

// --- SelectionButton Component ---
// Incorporates micro-interactions: scale animation and haptic feedback
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface SelectionButtonProps {
  selected: boolean;
  onPress: () => void;
  emoji: string;
  label: string;
  style?: ViewStyle;
  emojiStyle?: TextStyle;
  textStyle?: TextStyle;
}

const SelectionButton: React.FC<SelectionButtonProps> = ({
  selected,
  onPress,
  emoji,
  label,
  style,
  emojiStyle,
  textStyle,
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (selected) {
      scale.value = withSequence(
        withTiming(1.1, { duration: 100 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      );
    } else {
      scale.value = withTiming(1, { duration: 200 });
    }
  }, [selected, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    hapticFeedback.selection();
    onPress();
  };

  return (
    <AnimatedTouchableOpacity
      style={[style, selected && styles.optionSelected, animatedStyle]}
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
    >
      <EmojiIcon emoji={emoji} size={(emojiStyle as { fontSize?: number })?.fontSize ?? 24} style={emojiStyle} label={label} />
      <Text style={textStyle}>{label}</Text>
    </AnimatedTouchableOpacity>
  );
};
// ---------------------------------

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
          <SelectionButton
            selected={petType === 'cat'}
            onPress={() => handlePetTypeChange('cat')}
            emoji="🐱"
            label={t('createPet.cat')}
            style={styles.optionButton}
            emojiStyle={styles.optionEmoji}
            textStyle={styles.optionText}
          />
          <SelectionButton
            selected={petType === 'dog'}
            onPress={() => handlePetTypeChange('dog')}
            emoji="🐶"
            label={t('createPet.dog')}
            style={styles.optionButton}
            emojiStyle={styles.optionEmoji}
            textStyle={styles.optionText}
          />
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
            style={[
              styles.charCount,
              {
                color:
                  name.length === 20
                    ? COLORS.STAT_LEVELS.LOW
                    : name.length >= 15
                    ? COLORS.STAT_LEVELS.MEDIUM
                    : '#666',
              },
            ]}
            accessibilityLabel={`${name.length} ${t('common.of', { defaultValue: 'of' })} 20`}
          >
            {name.length}/20
          </Text>
        </View>

        <Text style={styles.label}>{t('createPet.gender')}</Text>
        <View style={styles.optionRow}>
          <SelectionButton
            selected={gender === 'male'}
            onPress={() => setGender('male')}
            emoji="♂️"
            label={t('createPet.male')}
            style={styles.genderButton}
            emojiStyle={styles.genderEmoji}
            textStyle={styles.genderText}
          />
          <SelectionButton
            selected={gender === 'female'}
            onPress={() => setGender('female')}
            emoji="♀️"
            label={t('createPet.female')}
            style={styles.genderButton}
            emojiStyle={styles.genderEmoji}
            textStyle={styles.genderText}
          />
        </View>

        <Text style={styles.label}>{t('createPet.coatColor')}</Text>
        <View style={styles.colorContainer}>
          <SelectionButton
            selected={color === 'base'}
            onPress={() => setColor('base')}
            emoji="⚪"
            label={t('createPet.white')}
            style={styles.colorButton}
            emojiStyle={styles.colorEmoji}
            textStyle={styles.colorText}
          />
          <SelectionButton
            selected={color === 'black'}
            onPress={() => setColor('black')}
            emoji="⚫"
            label={t('createPet.black')}
            style={styles.colorButton}
            emojiStyle={styles.colorEmoji}
            textStyle={styles.colorText}
          />
          {petType === 'dog' && (
            <>
              <SelectionButton
                selected={color === 'brown'}
                onPress={() => setColor('brown')}
                emoji="🟤"
                label={t('createPet.brown')}
                style={styles.colorButton}
                emojiStyle={styles.colorEmoji}
                textStyle={styles.colorText}
              />
              <SelectionButton
                selected={color === 'whiteandbrown'}
                onPress={() => setColor('whiteandbrown')}
                emoji="🤍🟤"
                label={t('createPet.whiteBrown')}
                style={styles.colorButton}
                emojiStyle={styles.colorEmoji}
                textStyle={styles.colorText}
              />
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
