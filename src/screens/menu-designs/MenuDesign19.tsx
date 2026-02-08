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

export const MenuDesign19: React.FC<Props> = ({ navigation }) => {
  const menu = useMenuLogic(navigation);
  const { pet, user, isGuest, t } = menu;

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : '?';
  const petEmoji = pet?.type === 'cat' ? '\uD83D\uDC31' : pet?.type === 'dog' ? '\uD83D\uDC36' : '\uD83D\uDC3E';

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
            <Feather name="arrow-left" size={22} color="#3e2723" />
          </TouchableOpacity>

          {/* Dino banner */}
          <View style={styles.dinoBanner}>
            <Text style={styles.dinoBannerEmoji}>{'\uD83E\uDD95'}</Text>
            <Text style={styles.dinoBannerEmoji}>{'\uD83C\uDF3F'}</Text>
            <Text style={styles.dinoBannerEmoji}>{'\uD83C\uDF0B'}</Text>
            <Text style={styles.dinoBannerEmoji}>{'\uD83E\uDD96'}</Text>
            <Text style={styles.dinoBannerEmoji}>{'\uD83C\uDF3F'}</Text>
            <Text style={styles.dinoBannerEmoji}>{'\uD83E\uDD95'}</Text>
          </View>

          {/* Title */}
          <View style={styles.titleArea}>
            <Text style={styles.title}>{'\uD83E\uDDB4'} Pet Care {'\uD83E\uDDB4'}</Text>
            <Text style={styles.subtitle}>ROAR into adventure! {'\uD83E\uDD96'}</Text>
          </View>

          {/* Fossil decoration */}
          <View style={styles.fossilRow}>
            <Text style={styles.fossilEmoji}>{'\uD83E\uDEA8'}</Text>
            <Text style={styles.fossilEmoji}>{'\uD83E\uDDB4'}</Text>
            <Text style={styles.fossilEmoji}>{'\uD83E\uDEA8'}</Text>
            <Text style={styles.fossilEmoji}>{'\uD83E\uDDB4'}</Text>
            <Text style={styles.fossilEmoji}>{'\uD83E\uDEA8'}</Text>
          </View>

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
                <Text style={styles.profileEmail} numberOfLines={1}>
                  {user?.email ?? t('menu.noEmail')}
                </Text>
                {isGuest && (
                  <View style={styles.guestBadge}>
                    <Feather name="user" size={10} color="#ffffff" />
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
                  <Text style={styles.signOutEmoji}>{'\uD83E\uDDB4'}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Hero card */}
          {pet ? (
            <TouchableOpacity
              style={styles.heroCard}
              onPress={menu.handleContinue}
              activeOpacity={0.8}
              accessibilityLabel={`Continue with ${pet.name}`}
              accessibilityRole="button"
            >
              <View style={styles.heroContent}>
                <View style={styles.heroLeft}>
                  <Text style={styles.heroEmoji}>
                    {'\uD83E\uDD95'}{petEmoji}
                  </Text>
                  <View style={styles.heroTextGroup}>
                    <Text style={styles.heroName}>{pet.name}</Text>
                    <Text style={styles.heroHint}>Continue exploring! {'\uD83C\uDF3F'}</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={24} color="rgba(255,255,255,0.7)" />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.heroCardEmpty}
              onPress={menu.handleNewPet}
              activeOpacity={0.8}
              accessibilityLabel="Create a new pet"
              accessibilityRole="button"
            >
              <View style={styles.heroContent}>
                <View style={styles.heroLeft}>
                  <Text style={styles.heroEmoji}>{'\uD83E\uDD5A'}</Text>
                  <View style={styles.heroTextGroup}>
                    <Text style={styles.heroName}>Hatch your pet! {'\uD83E\uDD5A'}</Text>
                    <Text style={styles.heroHint}>{t('menu.createPetHint')}</Text>
                  </View>
                </View>
                <Feather name="plus-circle" size={24} color="rgba(255,255,255,0.7)" />
              </View>
            </TouchableOpacity>
          )}

          {/* Prehistoric decoration */}
          <View style={styles.prehistoricRow}>
            <Text style={styles.prehistoricEmoji}>{'\uD83C\uDF3E'}</Text>
            <Text style={styles.prehistoricEmoji}>{'\uD83E\uDDB4'}</Text>
            <Text style={styles.prehistoricEmoji}>{'\uD83C\uDF0B'}</Text>
            <Text style={styles.prehistoricEmoji}>{'\uD83E\uDDB4'}</Text>
            <Text style={styles.prehistoricEmoji}>{'\uD83C\uDF3E'}</Text>
          </View>

          {/* New pet button (if pet exists) */}
          {pet && (
            <TouchableOpacity
              style={styles.newPetButton}
              onPress={menu.handleNewPet}
              activeOpacity={0.8}
              accessibilityLabel="Create a new pet"
              accessibilityRole="button"
            >
              <Feather name="plus" size={18} color="#ffffff" />
              <Text style={styles.newPetButtonText}>{t('menu.createPet')}</Text>
            </TouchableOpacity>
          )}

          {/* Bottom section */}
          <View style={styles.bottomSection}>
            {/* Language card */}
            <View style={styles.languageCard}>
              <LanguageSelector />
            </View>

            {/* Delete pet */}
            {pet && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={menu.handleDeletePet}
                accessibilityLabel="Delete pet"
                accessibilityRole="button"
              >
                <Text style={styles.deleteEmoji}>{'\uD83C\uDF0B'}</Text>
                <Text style={styles.deleteText}>Delete {pet.name}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer emoji row */}
          <View style={styles.footer}>
            <Text style={styles.footerEmoji}>{'\uD83E\uDD96'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83E\uDD5A'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83E\uDD95'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83E\uDD5A'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83E\uDD96'}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      <MenuModals {...menu} />
    </View>
  );
};

const styles = StyleSheet.create({
  // ── Layout ──────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: '#f5e6c8',
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
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#8d6e63',
    shadowColor: '#8d6e63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },

  // ── Dino banner ───────────────────────────────────────
  dinoBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  dinoBannerEmoji: {
    fontSize: 30,
  },

  // ── Title area ────────────────────────────────────────
  titleArea: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#4caf50',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: 'rgba(76, 175, 80, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: '#8d6e63',
    fontSize: 17,
    fontWeight: '600',
    marginTop: 8,
    letterSpacing: 0.5,
  },

  // ── Fossil decoration ─────────────────────────────────
  fossilRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  fossilEmoji: {
    fontSize: 20,
    opacity: 0.7,
  },

  // ── Profile card ──────────────────────────────────────
  profileCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#8d6e63',
    shadowColor: '#8d6e63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#4caf50',
  },
  avatarText: {
    color: '#4caf50',
    fontSize: 22,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    color: '#3e2723',
    fontSize: 16,
    fontWeight: '700',
  },
  profileEmail: {
    color: '#6d4c41',
    fontSize: 13,
    marginTop: 2,
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#81d4fa',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
    gap: 4,
  },
  guestBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  signOutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(141, 110, 99, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#8d6e63',
  },
  signOutEmoji: {
    fontSize: 20,
  },

  // ── Hero card (with pet) ────────────────────────────
  heroCard: {
    backgroundColor: '#4caf50',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#8d6e63',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  heroCardEmpty: {
    backgroundColor: '#ef5350',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#8d6e63',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
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
    fontSize: 38,
    marginRight: 16,
  },
  heroTextGroup: {
    flex: 1,
  },
  heroName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  heroHint: {
    color: '#c8e6c9',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },

  // ── Prehistoric decoration ──────────────────────────
  prehistoricRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 14,
  },
  prehistoricEmoji: {
    fontSize: 20,
    opacity: 0.8,
  },

  // ── New pet button ──────────────────────────────────
  newPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#66bb6a',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
    borderWidth: 2,
    borderColor: '#4caf50',
    shadowColor: '#8d6e63',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  newPetButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Bottom section ──────────────────────────────────
  bottomSection: {
    gap: 14,
  },
  languageCard: {
    backgroundColor: '#81d4fa',
    borderRadius: 20,
    padding: 14,
    shadowColor: '#8d6e63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 83, 80, 0.15)',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(239, 83, 80, 0.35)',
    shadowColor: '#8d6e63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  deleteEmoji: {
    fontSize: 16,
  },
  deleteText: {
    color: '#c62828',
    fontSize: 14,
    fontWeight: '600',
  },

  // ── Footer ──────────────────────────────────────────
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    gap: 12,
  },
  footerEmoji: {
    fontSize: 24,
    opacity: 0.7,
  },
});
