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

export const MenuDesign13: React.FC<Props> = ({ navigation }) => {
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
            <Feather name="arrow-left" size={22} color="#ffd60a" />
          </TouchableOpacity>

          {/* Star banner */}
          <View style={styles.starBanner}>
            <Text style={styles.starBannerEmoji}>{'\u2728'}</Text>
            <Text style={styles.starBannerEmoji}>{'\uD83C\uDF1F'}</Text>
            <Text style={styles.starBannerEmoji}>{'\uD83D\uDE80'}</Text>
            <Text style={styles.starBannerEmoji}>{'\uD83E\uDE90'}</Text>
            <Text style={styles.starBannerEmoji}>{'\u2B50'}</Text>
            <Text style={styles.starBannerEmoji}>{'\u2728'}</Text>
          </View>

          {/* Title */}
          <View style={styles.titleArea}>
            <Text style={styles.title}>Pet Care</Text>
            <Text style={styles.subtitle}>Explore the galaxy! {'\uD83D\uDEF8'}</Text>
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
                  <Text style={styles.signOutEmoji}>{'\uD83D\uDE80'}</Text>
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
                    {'\uD83D\uDE80'}{petEmoji}
                  </Text>
                  <View style={styles.heroTextGroup}>
                    <Text style={styles.heroName}>{pet.name}</Text>
                    <Text style={styles.heroHint}>Blast off! {'\u2B50'}</Text>
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
                  <Text style={styles.heroEmoji}>{'\uD83D\uDE80'}</Text>
                  <View style={styles.heroTextGroup}>
                    <Text style={styles.heroName}>Launch your pet! {'\uD83D\uDE80'}</Text>
                    <Text style={styles.heroHint}>{t('menu.createPetHint')}</Text>
                  </View>
                </View>
                <Feather name="star" size={24} color="rgba(255,255,255,0.7)" />
              </View>
            </TouchableOpacity>
          )}

          {/* Star field decoration */}
          <View style={styles.starField}>
            <Text style={styles.starFieldEmoji}>{'\uD83D\uDCAB'}</Text>
            <Text style={styles.starFieldEmoji}>{'\u2B50'}</Text>
            <Text style={styles.starFieldEmoji}>{'\uD83D\uDCAB'}</Text>
            <Text style={styles.starFieldEmoji}>{'\u2B50'}</Text>
            <Text style={styles.starFieldEmoji}>{'\uD83D\uDCAB'}</Text>
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
                <Text style={styles.deleteEmoji}>{'\u26A0\uFE0F'}</Text>
                <Text style={styles.deleteText}>Delete {pet.name}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer emoji row */}
          <View style={styles.footer}>
            <Text style={styles.footerEmoji}>{'\uD83C\uDF19'}</Text>
            <Text style={styles.footerEmoji}>{'\u2728'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83E\uDE90'}</Text>
            <Text style={styles.footerEmoji}>{'\u2728'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83C\uDF19'}</Text>
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
    backgroundColor: '#0b0c2a',
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
    backgroundColor: 'rgba(91, 44, 142, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 10, 0.3)',
    shadowColor: '#5b2c8e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 3,
  },

  // ── Star banner ─────────────────────────────────────────
  starBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  starBannerEmoji: {
    fontSize: 28,
  },

  // ── Title area ──────────────────────────────────────────
  titleArea: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    color: '#ffd60a',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: 'rgba(255, 214, 10, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    color: '#7ec8e3',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    letterSpacing: 0.5,
  },

  // ── Profile card ────────────────────────────────────────
  profileCard: {
    backgroundColor: '#5b2c8e',
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ffd60a',
    shadowColor: '#5b2c8e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 5,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 214, 10, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffd60a',
  },
  avatarText: {
    color: '#ffd60a',
    fontSize: 22,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  profileEmail: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    marginTop: 2,
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#118ab2',
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
    backgroundColor: 'rgba(255, 214, 10, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 10, 0.3)',
  },
  signOutEmoji: {
    fontSize: 20,
  },

  // ── Hero card (with pet) ──────────────────────────────
  heroCard: {
    backgroundColor: '#118ab2',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#5b2c8e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 6,
  },
  heroCardEmpty: {
    backgroundColor: '#ef476f',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#5b2c8e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
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
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  heroHint: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },

  // ── Star field decoration ─────────────────────────────
  starField: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 14,
  },
  starFieldEmoji: {
    fontSize: 20,
    opacity: 0.8,
  },

  // ── New pet button ────────────────────────────────────
  newPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5b2c8e',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 10, 0.25)',
    shadowColor: '#5b2c8e',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 3,
  },
  newPetButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Bottom section ────────────────────────────────────
  bottomSection: {
    gap: 14,
  },
  languageCard: {
    backgroundColor: '#ffd60a',
    borderRadius: 20,
    padding: 14,
    shadowColor: '#5b2c8e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 3,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d90429',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
    shadowColor: '#5b2c8e',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 3,
  },
  deleteEmoji: {
    fontSize: 16,
  },
  deleteText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  // ── Footer ────────────────────────────────────────────
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
