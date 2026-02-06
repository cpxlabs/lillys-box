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

export const MenuDesign7: React.FC<Props> = ({ navigation }) => {
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
            <Feather name="arrow-left" size={24} color="#5c3d2e" />
          </TouchableOpacity>

          {/* Profile section — stacked cards */}
          <View style={styles.profileStackWrapper}>
            <View style={styles.profileShadowCard} />
            <View style={styles.profileCard}>
              <View style={styles.profileRow}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{userInitial}</Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName} numberOfLines={1}>
                    {user?.email ? user.email.split('@')[0] : t('menu.guest')}
                  </Text>
                  <Text style={styles.profileEmail} numberOfLines={1}>
                    {user?.email ?? t('menu.noEmail')}
                  </Text>
                  {isGuest && (
                    <View style={styles.guestBadge}>
                      <Feather name="user" size={10} color="#8d6e63" />
                      <Text style={styles.guestBadgeText}>{t('menu.guest')}</Text>
                    </View>
                  )}
                </View>
                {!isGuest && (
                  <TouchableOpacity
                    style={styles.signOutButton}
                    onPress={menu.handleSignOut}
                    accessibilityLabel="Sign out"
                    accessibilityRole="button"
                  >
                    <Feather name="log-out" size={16} color="#8d6e63" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Title section */}
          <View style={styles.titleArea}>
            <Text style={styles.title}>Pet Care</Text>
            <View style={styles.titleLine} />
            <Text style={styles.subtitle}>{t('menu.subtitle')}</Text>
          </View>

          {/* Hero card — three-layer stack */}
          {pet ? (
            <View style={styles.heroStackWrapper}>
              <View style={styles.heroBackCard} />
              <View style={styles.heroMiddleCard} />
              <TouchableOpacity
                style={styles.heroFrontCard}
                onPress={menu.handleContinue}
                activeOpacity={0.85}
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
                  <View style={styles.heroArrow}>
                    <Feather name="arrow-right" size={22} color="#fff" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.heroStackWrapper}>
              <View style={styles.heroBackCard} />
              <View style={styles.heroMiddleCard} />
              <TouchableOpacity
                style={styles.heroFrontCard}
                onPress={menu.handleNewPet}
                activeOpacity={0.85}
                accessibilityLabel="Create a new pet"
                accessibilityRole="button"
              >
                <View style={styles.heroContent}>
                  <View style={styles.heroLeft}>
                    <Text style={styles.heroEmoji}>{'\u2728'}</Text>
                    <View style={styles.heroTextGroup}>
                      <Text style={styles.heroName}>{t('menu.createPet')}</Text>
                      <Text style={styles.heroHint}>{t('menu.createPetHint')}</Text>
                    </View>
                  </View>
                  <View style={styles.heroArrow}>
                    <Feather name="plus" size={22} color="#fff" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* New pet button (when pet exists) */}
          {pet && (
            <View style={styles.newPetStackWrapper}>
              <View style={styles.newPetShadowCard} />
              <TouchableOpacity
                style={styles.newPetCard}
                onPress={menu.handleNewPet}
                activeOpacity={0.85}
                accessibilityLabel="Create a new pet"
                accessibilityRole="button"
              >
                <Feather name="plus-circle" size={18} color="#f4845f" />
                <Text style={styles.newPetText}>{t('menu.createPet')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Bottom row — language and delete */}
          <View style={styles.bottomRow}>
            <View style={styles.bottomCardWrapper}>
              <View style={styles.bottomShadowCard} />
              <View style={styles.bottomCard}>
                <LanguageSelector />
              </View>
            </View>
            {pet && (
              <View style={styles.deleteCardWrapper}>
                <View style={styles.deleteShadowCard} />
                <TouchableOpacity
                  style={styles.deleteCard}
                  onPress={menu.handleDeletePet}
                  accessibilityLabel="Delete pet"
                  accessibilityRole="button"
                >
                  <Feather name="trash-2" size={20} color="#e57373" />
                </TouchableOpacity>
              </View>
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
    backgroundColor: '#faf3e0',
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
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },

  // ── Profile stacked cards ─────────────────────────────
  profileStackWrapper: {
    position: 'relative',
    marginBottom: 28,
  },
  profileShadowCard: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: '#f0e6d3',
    borderRadius: 16,
    transform: [{ rotate: '2deg' }],
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#5c3d2e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f4845f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    color: '#5c3d2e',
    fontSize: 16,
    fontWeight: '700',
  },
  profileEmail: {
    color: '#8d6e63',
    fontSize: 13,
    marginTop: 2,
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f0e6d3',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
    gap: 4,
  },
  guestBadgeText: {
    color: '#8d6e63',
    fontSize: 11,
    fontWeight: '600',
  },
  signOutButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0e6d3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Title area ──────────────────────────────────────────
  titleArea: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    color: '#5c3d2e',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontFamily: undefined, // uses system serif-style bold via fontWeight
  },
  titleLine: {
    width: 60,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#f4845f',
    marginTop: 10,
    marginBottom: 10,
  },
  subtitle: {
    color: '#bcaaa4',
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  // ── Hero three-layer stack ────────────────────────────
  heroStackWrapper: {
    position: 'relative',
    marginBottom: 20,
    // Extra padding at bottom/right to accommodate offset cards
    paddingBottom: 8,
    paddingRight: 4,
  },
  heroBackCard: {
    position: 'absolute',
    top: 8,
    left: -4,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8d7b8',
    borderRadius: 16,
    transform: [{ rotate: '3deg' }],
  },
  heroMiddleCard: {
    position: 'absolute',
    top: 4,
    left: -2,
    right: 2,
    bottom: 4,
    backgroundColor: '#fce8d5',
    borderRadius: 16,
    transform: [{ rotate: '1.5deg' }],
  },
  heroFrontCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#5c3d2e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
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
    fontSize: 44,
    marginRight: 16,
  },
  heroTextGroup: {
    flex: 1,
  },
  heroName: {
    color: '#5c3d2e',
    fontSize: 20,
    fontWeight: '700',
  },
  heroHint: {
    color: '#bcaaa4',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  heroArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f4845f',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f4845f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  // ── New pet card (secondary action) ───────────────────
  newPetStackWrapper: {
    position: 'relative',
    marginBottom: 20,
    paddingBottom: 4,
    paddingRight: 2,
  },
  newPetShadowCard: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: -3,
    bottom: -1,
    backgroundColor: '#f0e6d3',
    borderRadius: 14,
    transform: [{ rotate: '-1.5deg' }],
  },
  newPetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
    shadowColor: '#5c3d2e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  newPetText: {
    color: '#f4845f',
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Bottom row ────────────────────────────────────────
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 4,
  },
  bottomCardWrapper: {
    flex: 1,
    position: 'relative',
    paddingBottom: 4,
    paddingRight: 2,
  },
  bottomShadowCard: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: -1,
    bottom: -1,
    backgroundColor: '#f0e6d3',
    borderRadius: 16,
    transform: [{ rotate: '1.5deg' }],
  },
  bottomCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#5c3d2e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  deleteCardWrapper: {
    position: 'relative',
    paddingBottom: 4,
    paddingRight: 2,
  },
  deleteShadowCard: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: -3,
    bottom: -1,
    backgroundColor: '#f0e6d3',
    borderRadius: 16,
    transform: [{ rotate: '-2deg' }],
  },
  deleteCard: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5c3d2e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
