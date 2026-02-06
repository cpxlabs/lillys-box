import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LanguageSelector } from '../../components/LanguageSelector';
import { useMenuLogic } from './useMenuLogic';
import { MenuModals } from './MenuModals';
import { ScreenNavigationProp } from '../../types/navigation';

type Props = {
  navigation: ScreenNavigationProp<'Menu'>;
};

const PET_EMOJIS = {
  cat: '\uD83D\uDC31',
  dog: '\uD83D\uDC36',
} as const;

export const MenuDesign5: React.FC<Props> = ({ navigation }) => {
  const menu = useMenuLogic(navigation);
  const { pet, user, isGuest, t, handleBack, handleContinue, handleNewPet, handleDeletePet, handleSignOut } = menu;

  const petEmoji = pet ? PET_EMOJIS[pet.type] || '\uD83D\uDC3E' : '\uD83D\uDC3E';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel={t('menu.back')}
        >
          <Feather name="arrow-left" size={24} color="#00f5d4" />
        </TouchableOpacity>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarContainer}>
              {user?.photo ? (
                <Image source={{ uri: user.photo }} style={styles.avatarImage} />
              ) : (
                <Feather name="user" size={24} color="#b388ff" />
              )}
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {user?.name || t('menu.guest')}
                </Text>
                {isGuest && (
                  <View style={styles.guestBadge}>
                    <Text style={styles.guestBadgeText}>{t('menu.guest')}</Text>
                  </View>
                )}
              </View>
              {user?.email ? (
                <Text style={styles.profileEmail} numberOfLines={1}>
                  {user.email}
                </Text>
              ) : null}
            </View>
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
              accessibilityRole="button"
              accessibilityLabel={t('menu.signOut')}
            >
              <Feather name="log-out" size={20} color="#00f5d4" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{t('menu.title', { defaultValue: 'Pet Care' })}</Text>
          <Text style={styles.subtitle}>{t('menu.subtitle', { defaultValue: 'Take care of your virtual pet' })}</Text>
        </View>

        {/* Hero Card */}
        {pet ? (
          <TouchableOpacity
            style={styles.heroCard}
            onPress={handleContinue}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={t('menu.continuePlaying', { name: pet.name })}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroEmoji}>{petEmoji}</Text>
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroPetName}>{pet.name}</Text>
                <Text style={styles.heroSubtitle}>{t('menu.continuePlaying', { defaultValue: 'Continue playing' })}</Text>
              </View>
              <Feather name="chevron-right" size={28} color="#00f5d4" />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.heroCardEmpty}
            onPress={handleNewPet}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={t('menu.createPet')}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroEmoji}>{petEmoji}</Text>
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroCreateText}>{t('menu.createPet', { defaultValue: 'Create New Pet' })}</Text>
                <Text style={styles.heroCreateSubtitle}>{t('menu.createPetSubtitle', { defaultValue: 'Start your adventure' })}</Text>
              </View>
              <Feather name="chevron-right" size={28} color="#ff6ec7" />
            </View>
          </TouchableOpacity>
        )}

        {/* New Pet Button (when pet exists) */}
        {pet && (
          <TouchableOpacity
            style={styles.newPetButton}
            onPress={handleNewPet}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={t('menu.createPet')}
          >
            <Feather name="plus-circle" size={20} color="#b388ff" />
            <Text style={styles.newPetButtonText}>{t('menu.createPet', { defaultValue: 'Create New Pet' })}</Text>
          </TouchableOpacity>
        )}

        {/* Bottom Row */}
        <View style={styles.bottomRow}>
          {/* Language Card */}
          <View style={styles.languageCard}>
            <Text style={styles.bottomCardLabel}>{t('menu.language', { defaultValue: 'Language' })}</Text>
            <LanguageSelector />
          </View>

          {/* Delete Card */}
          {pet && (
            <TouchableOpacity
              style={styles.deleteCard}
              onPress={handleDeletePet}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={t('menu.deletePet')}
            >
              <Feather name="trash-2" size={20} color="#ff4757" />
              <Text style={styles.deleteText}>{t('menu.deletePet', { defaultValue: 'Delete Pet' })}</Text>
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
    backgroundColor: '#0a0a1a',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  /* Back Button */
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 16,
  },

  /* Profile Card */
  profileCard: {
    backgroundColor: '#141428',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#b388ff',
    padding: 20,
    marginBottom: 24,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a1a35',
    borderWidth: 2,
    borderColor: '#b388ff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 14,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  profileInfo: {
    flex: 1,
    marginRight: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    flexShrink: 1,
  },
  profileEmail: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  guestBadge: {
    backgroundColor: '#ff6ec7',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  guestBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  signOutButton: {
    padding: 8,
  },

  /* Title Section */
  titleSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#00f5d4',
    letterSpacing: 1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#555555',
    fontWeight: '500',
  },

  /* Hero Card - With Pet */
  heroCard: {
    backgroundColor: '#1a1a35',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#00f5d4',
    padding: 24,
    marginBottom: 16,
    shadowColor: '#00f5d4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  heroTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  heroPetName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#00f5d4',
    fontWeight: '600',
  },

  /* Hero Card - No Pet */
  heroCardEmpty: {
    backgroundColor: '#1a1a35',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ff6ec7',
    padding: 24,
    marginBottom: 16,
    shadowColor: '#ff6ec7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
  },
  heroCreateText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ff6ec7',
    marginBottom: 4,
  },
  heroCreateSubtitle: {
    fontSize: 14,
    color: '#b388ff',
    fontWeight: '600',
  },

  /* New Pet Button */
  newPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#141428',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#b388ff',
    padding: 16,
    marginBottom: 24,
    gap: 10,
  },
  newPetButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#b388ff',
  },

  /* Bottom Row */
  bottomRow: {
    flexDirection: 'row',
    gap: 12,
  },
  languageCard: {
    flex: 1,
    backgroundColor: '#141428',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#b388ff44',
    padding: 16,
    alignItems: 'center',
  },
  bottomCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  deleteCard: {
    backgroundColor: '#141428',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ff4757',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  deleteText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ff4757',
  },
});

