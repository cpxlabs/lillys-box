import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LanguageSelector } from '../../components/LanguageSelector';
import { useMenuLogic } from './useMenuLogic';
import { MenuModals } from './MenuModals';
import { ScreenNavigationProp } from '../../types/navigation';

const PET_EMOJIS: Record<string, string> = {
  cat: '\uD83D\uDC31',
  dog: '\uD83D\uDC36',
};

type Props = {
  navigation: ScreenNavigationProp<'Menu'>;
};

export const MenuDesign2: React.FC<Props> = ({ navigation }) => {
  const menu = useMenuLogic(navigation);
  const { pet, user, isGuest, t, handleBack, handleContinue, handleNewPet, handleDeletePet, handleSignOut } = menu;

  const displayName = user?.name || user?.email?.split('@')[0] || 'Guest';
  const displayEmail = user?.email || 'No email';
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const petEmoji = pet ? (PET_EMOJIS[pet.type] || '\uD83D\uDC3E') : '\uD83D\uDC3E';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Feather name="chevron-left" size={22} color="#4a5568" />
        </TouchableOpacity>

        {/* Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{avatarInitial}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName} numberOfLines={1}>
                {displayName}
              </Text>
              <Text style={styles.profileEmail} numberOfLines={1}>
                {displayEmail}
              </Text>
              {isGuest && (
                <View style={styles.guestBadge}>
                  <Text style={styles.guestBadgeText}>Guest</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Sign out"
            >
              <Feather name="log-out" size={18} color="#718096" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{t('menu.title', 'Pet Care')}</Text>
          <Text style={styles.subtitle}>
            {t('menu.subtitle', 'Take care of your virtual companion')}
          </Text>
        </View>

        {/* Hero Card */}
        <TouchableOpacity
          style={styles.heroCard}
          onPress={pet ? handleContinue : handleNewPet}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={pet ? `Continue with ${pet.name}` : 'Create a new pet'}
        >
          {pet ? (
            <View style={styles.heroContent}>
              <Text style={styles.heroEmoji}>{petEmoji}</Text>
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroPetName}>{pet.name}</Text>
                <Text style={styles.heroHint}>
                  {t('menu.continuePlaying', 'Tap to continue playing')}
                </Text>
              </View>
              <View style={styles.heroArrowCircle}>
                <Feather name="arrow-right" size={22} color="#ffffff" />
              </View>
            </View>
          ) : (
            <View style={styles.heroContent}>
              <View style={styles.heroNewPetIcon}>
                <Feather name="plus" size={32} color="#7c5cbf" />
              </View>
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroPetName}>
                  {t('menu.createPet', 'Create New Pet')}
                </Text>
                <Text style={styles.heroHint}>
                  {t('menu.createPetHint', 'Start your pet care journey')}
                </Text>
              </View>
              <View style={styles.heroArrowCircle}>
                <Feather name="arrow-right" size={22} color="#ffffff" />
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* Bottom Row: Language Selector + Delete Button */}
        <View style={styles.bottomRow}>
          <View style={styles.languageCard}>
            <Text style={styles.languageLabel}>
              {t('menu.language', 'Language')}
            </Text>
            <LanguageSelector />
          </View>

          {pet && (
            <TouchableOpacity
              style={styles.deleteCard}
              onPress={handleDeletePet}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Delete ${pet.name}`}
            >
              <Feather name="trash-2" size={20} color="#e53e3e" />
              <Text style={styles.deleteText}>
                {t('menu.deletePet', 'Delete Pet')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <MenuModals {...menu} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e5ec',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  /* Back Button - raised neomorphic circle */
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0e5ec',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },

  /* Profile Card - raised neomorphic */
  profileCard: {
    backgroundColor: '#e0e5ec',
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#e0e5ec',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#7c5cbf',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4a5568',
  },
  profileEmail: {
    fontSize: 13,
    color: '#718096',
    marginTop: 2,
  },
  guestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#d1d9e6',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 6,
  },
  guestBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#718096',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  signOutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d1d9e6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#a3b1c6',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },

  /* Title Section */
  titleSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#4a5568',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 6,
    fontWeight: '500',
  },

  /* Hero Card - large raised neomorphic */
  heroCard: {
    backgroundColor: '#e0e5ec',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  heroNewPetIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e5ec',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  heroTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  heroPetName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4a5568',
    marginBottom: 4,
  },
  heroHint: {
    fontSize: 13,
    color: '#a0aec0',
    fontWeight: '500',
  },
  heroArrowCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7c5cbf',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },

  /* Bottom Row */
  bottomRow: {
    flexDirection: 'row',
    gap: 14,
  },
  languageCard: {
    flex: 1,
    backgroundColor: '#e0e5ec',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#a3b1c6',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  languageLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#a0aec0',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  deleteCard: {
    flex: 1,
    backgroundColor: '#d1d9e6',
    borderRadius: 20,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#a3b1c6',
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 2,
  },
  deleteText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e53e3e',
    marginTop: 6,
  },
});
