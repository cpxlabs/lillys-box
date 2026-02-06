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

export const MenuDesign6: React.FC<Props> = ({ navigation }) => {
  const menu = useMenuLogic(navigation);
  const { pet, user, isGuest, t } = menu;

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : '?';
  const petEmoji = pet ? (PET_EMOJIS[pet.type] ?? '\uD83D\uDC3E') : null;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={menu.handleBack}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Feather name="arrow-left" size={22} color="#e91e63" />
          </TouchableOpacity>

          {/* Profile card */}
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{userInitial}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {user?.email ? user.email.split('@')[0] : t('menu.guest')}
                </Text>
                {isGuest && (
                  <View style={styles.guestBadge}>
                    <Text style={styles.guestBadgeText}>
                      {'\u2B50'} Guest Mode
                    </Text>
                  </View>
                )}
              </View>
              {!isGuest && (
                <TouchableOpacity
                  style={styles.signOutPill}
                  onPress={menu.handleSignOut}
                  accessibilityLabel="Sign out"
                  accessibilityRole="button"
                >
                  <Feather name="log-out" size={14} color="#7b1fa2" />
                  <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Title area */}
          <View style={styles.titleArea}>
            <Text style={styles.emojiRow}>
              {'\uD83D\uDC3E'} {'\uD83D\uDC3E'} {'\uD83D\uDC3E'}
            </Text>
            <Text style={styles.title}>Pet Care</Text>
            <Text style={styles.subtitle}>
              {'\u2764\uFE0F'} {t('menu.subtitle')} {'\u2764\uFE0F'}
            </Text>
          </View>

          {/* Hero card */}
          {pet ? (
            <TouchableOpacity
              style={styles.heroCardContinue}
              onPress={menu.handleContinue}
              activeOpacity={0.8}
              accessibilityLabel={`Continue with ${pet.name}`}
              accessibilityRole="button"
            >
              <View style={styles.heroContent}>
                <View style={styles.heroLeft}>
                  <Text style={styles.heroEmoji}>{petEmoji}</Text>
                  <View style={styles.heroTextGroup}>
                    <Text style={styles.heroName}>{pet.name}</Text>
                    <Text style={styles.heroHint}>{t('menu.tapToContinue')}</Text>
                  </View>
                </View>
                <View style={styles.heroArrowContinue}>
                  <Feather name="chevron-right" size={28} color="#388e3c" />
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.heroCardCreate}
              onPress={menu.handleNewPet}
              activeOpacity={0.8}
              accessibilityLabel="Create a new pet"
              accessibilityRole="button"
            >
              <View style={styles.heroContent}>
                <View style={styles.heroLeft}>
                  <Text style={styles.heroEmoji}>{'\u2728'}</Text>
                  <View style={styles.heroTextGroup}>
                    <Text style={styles.heroNameCreate}>{t('menu.createPet')}</Text>
                    <Text style={styles.heroHintCreate}>{t('menu.createPetHint')}</Text>
                  </View>
                </View>
                <View style={styles.heroArrowCreate}>
                  <Feather name="chevron-right" size={28} color="#7b1fa2" />
                </View>
              </View>
            </TouchableOpacity>
          )}

          {/* New pet button (when pet exists) */}
          {pet && (
            <TouchableOpacity
              style={styles.newPetCard}
              onPress={menu.handleNewPet}
              activeOpacity={0.8}
              accessibilityLabel="Create a new pet"
              accessibilityRole="button"
            >
              <View style={styles.newPetContent}>
                <Text style={styles.newPetEmoji}>{'\uD83C\uDF1F'}</Text>
                <Text style={styles.newPetText}>{t('menu.createPet')}</Text>
                <Feather name="plus-circle" size={22} color="#7b1fa2" />
              </View>
            </TouchableOpacity>
          )}

          {/* Bottom row */}
          <View style={styles.bottomRow}>
            <View style={styles.languageCard}>
              <LanguageSelector />
            </View>
            {pet && (
              <TouchableOpacity
                style={styles.deleteCard}
                onPress={menu.handleDeletePet}
                accessibilityLabel="Delete pet"
                accessibilityRole="button"
              >
                <Feather name="trash-2" size={22} color="#d32f2f" />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <MenuModals {...menu} />
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Layout ──────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: '#fff9c4',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 48,
  },

  // ── Back button ─────────────────────────────────────────
  backButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fce4ec',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#f48fb1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  // ── Profile card ────────────────────────────────────────
  profileCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 28,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#90caf9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#bbdefb',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#90caf9',
  },
  avatarText: {
    color: '#1565c0',
    fontSize: 28,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    color: '#1565c0',
    fontSize: 18,
    fontWeight: '800',
  },
  guestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#bbdefb',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 8,
  },
  guestBadgeText: {
    color: '#1565c0',
    fontSize: 13,
    fontWeight: '700',
  },
  signOutPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3e5f5',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
    minHeight: 56,
  },
  signOutText: {
    color: '#7b1fa2',
    fontSize: 13,
    fontWeight: '700',
  },

  // ── Title area ──────────────────────────────────────────
  titleArea: {
    alignItems: 'center',
    marginBottom: 28,
  },
  emojiRow: {
    fontSize: 28,
    marginBottom: 8,
  },
  title: {
    color: '#e91e63',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#ad1457',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    letterSpacing: 0.3,
  },

  // ── Hero card (continue with pet) ─────────────────────
  heroCardContinue: {
    backgroundColor: '#c8e6c9',
    borderRadius: 28,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#81c784',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  heroEmoji: {
    fontSize: 64,
    marginRight: 16,
  },
  heroTextGroup: {
    flex: 1,
  },
  heroName: {
    color: '#2e7d32',
    fontSize: 22,
    fontWeight: '800',
  },
  heroHint: {
    color: '#388e3c',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    opacity: 0.7,
  },
  heroArrowContinue: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#a5d6a7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Hero card (create new pet) ────────────────────────
  heroCardCreate: {
    backgroundColor: '#e1bee7',
    borderRadius: 28,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#ce93d8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },
  heroNameCreate: {
    color: '#6a1b9a',
    fontSize: 22,
    fontWeight: '800',
  },
  heroHintCreate: {
    color: '#7b1fa2',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    opacity: 0.7,
  },
  heroArrowCreate: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ce93d8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── New pet card (secondary action) ───────────────────
  newPetCard: {
    backgroundColor: '#f3e5f5',
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#ce93d8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  newPetContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 56,
  },
  newPetEmoji: {
    fontSize: 24,
  },
  newPetText: {
    color: '#7b1fa2',
    fontSize: 17,
    fontWeight: '800',
  },

  // ── Bottom row ────────────────────────────────────────
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  languageCard: {
    flex: 1,
    backgroundColor: '#ffe0b2',
    borderRadius: 28,
    padding: 14,
    shadowColor: '#ffb74d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  deleteCard: {
    backgroundColor: '#ffcdd2',
    borderRadius: 28,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ef9a9a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
});
