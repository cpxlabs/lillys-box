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

const RAINBOW_COLORS = ['#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#74c0fc', '#b197fc'];

export const MenuDesign14: React.FC<Props> = ({ navigation }) => {
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

          {/* Rainbow emoji banner */}
          <View style={styles.rainbowBanner}>
            <Text style={styles.bannerEmoji}>{'\uD83C\uDF08'}</Text>
            <Text style={styles.bannerEmoji}>{'\u2600\uFE0F'}</Text>
            <Text style={styles.bannerEmoji}>{'\uD83E\uDD8B'}</Text>
            <Text style={styles.bannerEmoji}>{'\u2B50'}</Text>
            <Text style={styles.bannerEmoji}>{'\uD83D\uDC96'}</Text>
            <Text style={styles.bannerEmoji}>{'\uD83C\uDF08'}</Text>
          </View>

          {/* Rainbow stripe bar */}
          <View style={styles.rainbowStripeBar}>
            {RAINBOW_COLORS.map((color, index) => (
              <View key={index} style={[styles.rainbowStripe, { backgroundColor: color }]} />
            ))}
          </View>

          {/* Title area */}
          <View style={styles.titleArea}>
            <Text style={styles.title}>Pet Care</Text>
            <Text style={styles.subtitle}>A rainbow of fun! {'\uD83C\uDF08'}</Text>
          </View>

          {/* Profile card with rainbow left border */}
          <View style={styles.profileCard}>
            <View style={styles.profileRainbowBorder}>
              {RAINBOW_COLORS.map((color, index) => (
                <View key={index} style={[styles.profileBorderSegment, { backgroundColor: color }]} />
              ))}
            </View>
            <View style={styles.profileInner}>
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
                      <Feather name="user" size={10} color="#7c6300" />
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
                    <Feather name="log-out" size={15} color="#b197fc" />
                    <Text style={styles.signOutText}>Sign Out</Text>
                  </TouchableOpacity>
                )}
              </View>
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
                  <Text style={styles.heroEmoji}>{petEmoji}</Text>
                  <View style={styles.heroTextGroup}>
                    <Text style={styles.heroName}>{pet.name}</Text>
                    <Text style={styles.heroHint}>Let's have fun! {'\uD83C\uDF89'}</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={24} color="rgba(255,255,255,0.8)" />
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
                  <Text style={styles.heroEmoji}>{'\u2728'}</Text>
                  <View style={styles.heroTextGroup}>
                    <Text style={styles.heroName}>Create your buddy! {'\uD83C\uDF08'}</Text>
                    <Text style={styles.heroHint}>{t('menu.createPetHint')}</Text>
                  </View>
                </View>
                <Feather name="plus-circle" size={24} color="rgba(255,255,255,0.8)" />
              </View>
            </TouchableOpacity>
          )}

          {/* Rainbow stripe bar separator */}
          <View style={styles.rainbowStripeBar}>
            {RAINBOW_COLORS.map((color, index) => (
              <View key={index} style={[styles.rainbowStripe, { backgroundColor: color }]} />
            ))}
          </View>

          {/* Bottom section */}
          <View style={styles.bottomSection}>
            {/* Language card */}
            <View style={styles.languageCard}>
              <LanguageSelector />
            </View>

            {/* New pet button */}
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

            {/* Delete pet */}
            {pet && (
              <TouchableOpacity
                style={styles.deleteCard}
                onPress={menu.handleDeletePet}
                activeOpacity={0.8}
                accessibilityLabel="Delete pet"
                accessibilityRole="button"
              >
                <Feather name="trash-2" size={16} color="#ffffff" />
                <Text style={styles.deleteText}>Delete {pet.name}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer decoration */}
          <View style={styles.footer}>
            <Text style={styles.footerEmoji}>{'\uD83D\uDC96'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83C\uDF08'}</Text>
            <Text style={styles.footerEmoji}>{'\u2B50'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83C\uDF08'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83D\uDC96'}</Text>
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
    backgroundColor: '#e3f6ff',
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
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#b197fc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },

  // ── Rainbow banner ──────────────────────────────────────
  rainbowBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    gap: 14,
  },
  bannerEmoji: {
    fontSize: 28,
  },

  // ── Rainbow stripe bar ──────────────────────────────────
  rainbowStripeBar: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 2,
    overflow: 'hidden',
  },
  rainbowStripe: {
    flex: 1,
    height: 4,
  },

  // ── Title area ──────────────────────────────────────────
  titleArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#7c3aed',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#ffa94d',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
    letterSpacing: 0.3,
  },

  // ── Profile card ────────────────────────────────────────
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#b197fc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 4,
  },
  profileRainbowBorder: {
    width: 6,
    flexDirection: 'column',
  },
  profileBorderSegment: {
    flex: 1,
  },
  profileInner: {
    flex: 1,
    padding: 18,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#e3f6ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#69db7c',
  },
  avatarText: {
    color: '#4c6ef5',
    fontSize: 21,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    color: '#4c6ef5',
    fontSize: 17,
    fontWeight: '700',
  },
  profileEmail: {
    color: '#74c0fc',
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#ffd43b',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
    gap: 4,
  },
  guestBadgeText: {
    color: '#7c6300',
    fontSize: 11,
    fontWeight: '700',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f0ff',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  signOutText: {
    color: '#b197fc',
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Hero card (pet exists) ────────────────────────────
  heroCard: {
    backgroundColor: '#69db7c',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#69db7c',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  heroCardEmpty: {
    backgroundColor: '#ffa94d',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#ffa94d',
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
    fontSize: 44,
    marginRight: 16,
  },
  heroTextGroup: {
    flex: 1,
  },
  heroName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  heroHint: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },

  // ── Bottom section ──────────────────────────────────────
  bottomSection: {
    gap: 14,
  },
  languageCard: {
    backgroundColor: '#74c0fc',
    borderRadius: 24,
    padding: 14,
    shadowColor: '#74c0fc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  newPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#b197fc',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
    shadowColor: '#b197fc',
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
  deleteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6b6b',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  deleteText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  // ── Footer ──────────────────────────────────────────────
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    gap: 14,
  },
  footerEmoji: {
    fontSize: 22,
    opacity: 0.8,
  },
});
