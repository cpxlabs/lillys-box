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

export const MenuDesign16: React.FC<Props> = ({ navigation }) => {
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
            <Feather name="arrow-left" size={22} color="#7c3aed" />
          </TouchableOpacity>

          {/* Magic castle banner */}
          <View style={styles.magicBanner}>
            <Text style={styles.magicBannerEmoji}>{'\u2728'}</Text>
            <Text style={styles.magicBannerEmoji}>{'\uD83C\uDFF0'}</Text>
            <Text style={styles.magicBannerEmoji}>{'\uD83D\uDC51'}</Text>
            <Text style={styles.magicBannerEmoji}>{'\uD83E\uDD84'}</Text>
            <Text style={styles.magicBannerEmoji}>{'\uD83C\uDFF0'}</Text>
            <Text style={styles.magicBannerEmoji}>{'\u2728'}</Text>
          </View>

          {/* Title */}
          <View style={styles.titleArea}>
            <Text style={styles.crownEmoji}>{'\uD83D\uDC51'}</Text>
            <Text style={styles.title}>Pet Care</Text>
            <Text style={styles.subtitle}>A magical adventure! {'\uD83E\uDE84'}</Text>
          </View>

          {/* Sparkle separator */}
          <View style={styles.sparkleSeparator}>
            <Text style={styles.sparkleEmoji}>{'\uD83D\uDCAB'}</Text>
            <Text style={styles.sparkleEmoji}>{'\u2728'}</Text>
            <Text style={styles.sparkleEmoji}>{'\uD83D\uDCAB'}</Text>
            <Text style={styles.sparkleEmoji}>{'\u2728'}</Text>
            <Text style={styles.sparkleEmoji}>{'\uD83D\uDCAB'}</Text>
          </View>

          {/* Profile card */}
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatarFrame}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{userInitial}</Text>
                </View>
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
                    <Feather name="star" size={10} color="#ffffff" />
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
                  <Feather name="log-out" size={15} color="#7c3aed" />
                  <Text style={styles.signOutText}>{'\uD83E\uDE84'} Sign Out</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Hero action card */}
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
                    {'\uD83E\uDD84'}{petEmoji}
                  </Text>
                  <View style={styles.heroTextGroup}>
                    <Text style={styles.heroName}>{pet.name}</Text>
                    <Text style={styles.heroHint}>Continue your quest! {'\u2728'}</Text>
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
                  <Text style={styles.heroEmoji}>{'\uD83E\uDD84'}</Text>
                  <View style={styles.heroTextGroup}>
                    <Text style={styles.heroNameEmpty}>Summon your pet! {'\uD83E\uDDDA'}</Text>
                    <Text style={styles.heroHintEmpty}>{t('menu.createPetHint')}</Text>
                  </View>
                </View>
                <Feather name="sparkles" size={24} color="rgba(255,255,255,0.7)" />
              </View>
            </TouchableOpacity>
          )}

          {/* Magic flowers separator */}
          <View style={styles.flowerSeparator}>
            <Text style={styles.flowerEmoji}>{'\uD83C\uDF38'}</Text>
            <Text style={styles.flowerEmoji}>{'\u2728'}</Text>
            <Text style={styles.flowerEmoji}>{'\uD83C\uDF38'}</Text>
            <Text style={styles.flowerEmoji}>{'\u2728'}</Text>
            <Text style={styles.flowerEmoji}>{'\uD83C\uDF38'}</Text>
          </View>

          {/* Bottom section */}
          <View style={styles.bottomSection}>
            {/* Language card */}
            <View style={styles.languageCard}>
              <LanguageSelector />
            </View>

            {/* New pet button (secondary if pet exists) */}
            {pet && (
              <TouchableOpacity
                style={styles.newPetButton}
                onPress={menu.handleNewPet}
                activeOpacity={0.8}
                accessibilityLabel="Create a new pet"
                accessibilityRole="button"
              >
                <Feather name="plus" size={18} color="#7c3aed" />
                <Text style={styles.newPetButtonText}>{t('menu.createPet')}</Text>
              </TouchableOpacity>
            )}

            {/* Delete pet */}
            {pet && (
              <View style={styles.deleteCard}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={menu.handleDeletePet}
                  accessibilityLabel="Delete pet"
                  accessibilityRole="button"
                >
                  <Feather name="trash-2" size={14} color="#be185d" />
                  <Text style={styles.deleteText}>Delete {pet.name}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerEmoji}>{'\uD83E\uDDDA'}</Text>
            <Text style={styles.footerEmoji}>{'\u2728'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83C\uDFF0'}</Text>
            <Text style={styles.footerEmoji}>{'\u2728'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83E\uDDDA'}</Text>
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
    backgroundColor: '#f3e8ff',
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
    backgroundColor: '#faf5ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#c084fc',
    shadowColor: '#c084fc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },

  // ── Magic banner ────────────────────────────────────────
  magicBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  magicBannerEmoji: {
    fontSize: 26,
  },

  // ── Title area ──────────────────────────────────────────
  titleArea: {
    alignItems: 'center',
    marginBottom: 12,
  },
  crownEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  title: {
    color: '#7c3aed',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#f472b6',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
    letterSpacing: 0.3,
  },

  // ── Sparkle separator ─────────────────────────────────────
  sparkleSeparator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
    gap: 10,
  },
  sparkleEmoji: {
    fontSize: 14,
    opacity: 0.8,
  },

  // ── Profile card ────────────────────────────────────────
  profileCard: {
    backgroundColor: '#faf5ff',
    borderRadius: 26,
    padding: 18,
    marginBottom: 22,
    borderWidth: 2,
    borderColor: '#fbbf24',
    shadowColor: '#c084fc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarFrame: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fbbf24',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#faf5ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  avatarText: {
    color: '#7c3aed',
    fontSize: 20,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    color: '#7c3aed',
    fontSize: 16,
    fontWeight: '700',
  },
  profileEmail: {
    color: '#a78bfa',
    fontSize: 13,
    marginTop: 2,
    opacity: 0.85,
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f472b6',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
    gap: 4,
  },
  guestBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ede9fe',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 5,
    borderWidth: 1,
    borderColor: '#c4b5fd',
  },
  signOutText: {
    color: '#7c3aed',
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Hero card (with pet) ────────────────────────────────
  heroCard: {
    backgroundColor: '#7c3aed',
    borderRadius: 26,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#c084fc',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
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
    color: '#fbbf24',
    fontSize: 22,
    fontWeight: '800',
  },
  heroHint: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
    opacity: 0.9,
  },

  // ── Hero card (empty / no pet) ──────────────────────────
  heroCardEmpty: {
    backgroundColor: '#60a5fa',
    borderRadius: 26,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#c084fc',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 6,
  },
  heroNameEmpty: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  heroHintEmpty: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },

  // ── Flower separator ──────────────────────────────────────
  flowerSeparator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
    marginTop: 6,
    gap: 10,
  },
  flowerEmoji: {
    fontSize: 16,
    opacity: 0.8,
  },

  // ── Bottom section ──────────────────────────────────────
  bottomSection: {
    gap: 14,
  },
  languageCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 26,
    padding: 14,
    shadowColor: '#c084fc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  newPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#faf5ff',
    borderRadius: 26,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
    borderWidth: 2,
    borderColor: '#c4b5fd',
    shadowColor: '#c084fc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  newPetButtonText: {
    color: '#7c3aed',
    fontSize: 15,
    fontWeight: '700',
  },
  deleteCard: {
    backgroundColor: '#fce7f3',
    borderRadius: 26,
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  deleteText: {
    color: '#be185d',
    fontSize: 14,
    fontWeight: '500',
  },

  // ── Footer ──────────────────────────────────────────────
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    gap: 12,
  },
  footerEmoji: {
    fontSize: 20,
    opacity: 0.7,
  },
});
