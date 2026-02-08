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

const SPRINKLE_COLORS_TOP = ['#ff6b8a', '#ffe066', '#7eb3ff', '#a8e6cf', '#ffb347', '#ff6b8a', '#7eb3ff', '#ffe066', '#a8e6cf', '#ffb347'];
const SPRINKLE_COLORS_BOTTOM = ['#7eb3ff', '#ff6b8a', '#ffe066', '#a8e6cf', '#ffb347', '#ff6b8a', '#ffe066', '#7eb3ff'];

export const MenuDesign18: React.FC<Props> = ({ navigation }) => {
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
            <Feather name="arrow-left" size={22} color="#8b5e3c" />
          </TouchableOpacity>

          {/* Ice cream banner */}
          <View style={styles.iceCreamBanner}>
            <Text style={styles.bannerEmoji}>{'\uD83C\uDF66'}</Text>
            <Text style={styles.bannerEmoji}>{'\uD83C\uDF68'}</Text>
            <Text style={styles.bannerEmoji}>{'\uD83C\uDF67'}</Text>
            <Text style={styles.bannerEmoji}>{'\uD83E\uDDC1'}</Text>
            <Text style={styles.bannerEmoji}>{'\uD83C\uDF70'}</Text>
            <Text style={styles.bannerEmoji}>{'\uD83C\uDF66'}</Text>
          </View>

          {/* Title */}
          <View style={styles.titleArea}>
            <Text style={styles.title}>Pet Care</Text>
            <Text style={styles.subtitle}>Sweet adventures! {'\uD83C\uDF68'}</Text>
          </View>

          {/* Sprinkles decoration */}
          <View style={styles.sprinklesRow}>
            {SPRINKLE_COLORS_TOP.map((color, index) => (
              <View
                key={`sprinkle-top-${index}`}
                style={[styles.sprinkleDot, { backgroundColor: color }]}
              />
            ))}
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
                    <Feather name="user" size={10} color="#3d6b4f" />
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
                  <Feather name="log-out" size={15} color="#d6336c" />
                  <Text style={styles.signOutText}>Sign Out</Text>
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
                  <Text style={styles.heroIceCreamEmoji}>{'\uD83C\uDF66'}</Text>
                  <Text style={styles.heroPetEmoji}>{petEmoji}</Text>
                  <View style={styles.heroTextGroup}>
                    <Text style={styles.heroName}>{pet.name}</Text>
                    <Text style={styles.heroHint}>Scoop up fun! {'\uD83C\uDF67'}</Text>
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
                  <Text style={styles.heroIceCreamEmoji}>{'\uD83E\uDDC1'}</Text>
                  <View style={styles.heroTextGroup}>
                    <Text style={styles.heroName}>Create your sweet pet!</Text>
                    <Text style={styles.heroHint}>{t('menu.createPetHint')}</Text>
                  </View>
                </View>
                <Feather name="plus-circle" size={24} color="rgba(255,255,255,0.7)" />
              </View>
            </TouchableOpacity>
          )}

          {/* More sprinkles decoration */}
          <View style={styles.sprinklesRow}>
            {SPRINKLE_COLORS_BOTTOM.map((color, index) => (
              <View
                key={`sprinkle-bottom-${index}`}
                style={[styles.sprinkleDot, { backgroundColor: color }]}
              />
            ))}
          </View>

          {/* Bottom section */}
          <View style={styles.bottomSection}>
            {/* New pet button (secondary when pet exists) */}
            {pet && (
              <TouchableOpacity
                style={styles.newPetButton}
                onPress={menu.handleNewPet}
                activeOpacity={0.8}
                accessibilityLabel="Create a new pet"
                accessibilityRole="button"
              >
                <Feather name="plus" size={18} color="#5c3a1e" />
                <Text style={styles.newPetButtonText}>{t('menu.createPet')}</Text>
              </TouchableOpacity>
            )}

            {/* Language card */}
            <View style={styles.languageCard}>
              <LanguageSelector />
            </View>

            {/* Delete pet */}
            {pet && (
              <TouchableOpacity
                style={styles.deleteCard}
                onPress={menu.handleDeletePet}
                accessibilityLabel="Delete pet"
                accessibilityRole="button"
              >
                <Feather name="trash-2" size={15} color="#a0522d" />
                <Text style={styles.deleteText}>Delete {pet.name}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer emoji row */}
          <View style={styles.footerRow}>
            <Text style={styles.footerEmoji}>{'\uD83C\uDF53'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83C\uDF6B'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83C\uDF66'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83C\uDF6B'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83C\uDF53'}</Text>
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
    backgroundColor: '#fce4b8',
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
    backgroundColor: '#fff5e6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#f0d6a0',
    shadowColor: '#8b5e3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },

  // ── Ice cream banner ──────────────────────────────────────
  iceCreamBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  bannerEmoji: {
    fontSize: 30,
  },

  // ── Title area ──────────────────────────────────────────
  titleArea: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#ff6b8a',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#8b5e3c',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    letterSpacing: 0.3,
  },

  // ── Sprinkles ─────────────────────────────────────────
  sprinklesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
    gap: 10,
  },
  sprinkleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // ── Profile card ────────────────────────────────────────
  profileCard: {
    backgroundColor: '#fff5e6',
    borderRadius: 26,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ff6b8a',
    shadowColor: '#d4956b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 5,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff5e6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#8b5e3c',
  },
  avatarText: {
    color: '#8b5e3c',
    fontSize: 22,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    color: '#5c3a1e',
    fontSize: 17,
    fontWeight: '700',
  },
  profileEmail: {
    color: '#8b5e3c',
    fontSize: 13,
    marginTop: 2,
    opacity: 0.8,
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#a8e6cf',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
    gap: 4,
  },
  guestBadgeText: {
    color: '#3d6b4f',
    fontSize: 11,
    fontWeight: '600',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe0e6',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  signOutText: {
    color: '#d6336c',
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Hero card (with pet) ──────────────────────────────────
  heroCard: {
    backgroundColor: '#ff6b8a',
    borderRadius: 28,
    padding: 24,
    marginBottom: 8,
    shadowColor: '#c94060',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 6,
  },
  heroCardEmpty: {
    backgroundColor: '#7eb3ff',
    borderRadius: 28,
    padding: 24,
    marginBottom: 8,
    shadowColor: '#5a8ad4',
    shadowOffset: { width: 0, height: 8 },
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
  heroIceCreamEmoji: {
    fontSize: 38,
    marginRight: 6,
  },
  heroPetEmoji: {
    fontSize: 42,
    marginRight: 14,
  },
  heroTextGroup: {
    flex: 1,
  },
  heroName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  heroHint: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },

  // ── Bottom section ────────────────────────────────────────
  bottomSection: {
    gap: 14,
  },
  newPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff5e6',
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#f0d6a0',
    gap: 8,
    shadowColor: '#d4956b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  newPetButtonText: {
    color: '#5c3a1e',
    fontSize: 15,
    fontWeight: '700',
  },
  languageCard: {
    backgroundColor: '#a8e6cf',
    borderRadius: 28,
    padding: 14,
    shadowColor: '#5cad8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 2,
  },
  deleteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139,94,60,0.12)',
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  deleteText: {
    color: '#a0522d',
    fontSize: 14,
    fontWeight: '500',
  },

  // ── Footer ────────────────────────────────────────────────
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    gap: 16,
  },
  footerEmoji: {
    fontSize: 22,
    opacity: 0.7,
  },
});
