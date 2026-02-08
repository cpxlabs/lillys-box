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

export const MenuDesign12: React.FC<Props> = ({ navigation }) => {
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
            <Feather name="arrow-left" size={22} color="#ffffff" />
          </TouchableOpacity>

          {/* Wave banner */}
          <View style={styles.waveBanner}>
            <Text style={styles.waveBannerEmoji}>{'\uD83C\uDF0A'}</Text>
            <Text style={styles.waveBannerEmoji}>{'\uD83D\uDC20'}</Text>
            <Text style={styles.waveBannerEmoji}>{'\uD83D\uDC1F'}</Text>
            <Text style={styles.waveBannerEmoji}>{'\uD83E\uDD80'}</Text>
            <Text style={styles.waveBannerEmoji}>{'\uD83D\uDC19'}</Text>
            <Text style={styles.waveBannerEmoji}>{'\uD83C\uDF0A'}</Text>
          </View>

          {/* Title */}
          <View style={styles.titleArea}>
            <Text style={styles.title}>
              {'\uD83D\uDC1A'} Pet Care {'\uD83D\uDC1A'}
            </Text>
            <Text style={styles.subtitle}>Dive into adventure! {'\uD83E\uDEE7'}</Text>
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
                    <Feather name="user" size={10} color="#023e8a" />
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
                  <Feather name="anchor" size={15} color="#0077b6" />
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
                  <Text style={styles.heroEmoji}>{petEmoji}</Text>
                  <View style={styles.heroTextGroup}>
                    <Text style={styles.heroName}>{pet.name}</Text>
                    <Text style={styles.heroHint}>Swim along! {'\uD83D\uDC20'}</Text>
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
                  <Text style={styles.heroEmoji}>{'\uD83D\uDC1F'}</Text>
                  <View style={styles.heroTextGroup}>
                    <Text style={styles.heroName}>Discover your pet!</Text>
                    <Text style={styles.heroHint}>{t('menu.createPetHint')}</Text>
                  </View>
                </View>
                <Feather name="plus-circle" size={24} color="rgba(255,255,255,0.7)" />
              </View>
            </TouchableOpacity>
          )}

          {/* Bubble decoration */}
          <View style={styles.bubbleRow}>
            <Text style={styles.bubbleEmoji}>{'\uD83E\uDEE7'}</Text>
            <Text style={styles.bubbleEmoji}>{'\uD83E\uDEE7'}</Text>
            <Text style={styles.bubbleEmoji}>{'\uD83E\uDEE7'}</Text>
            <Text style={styles.bubbleEmoji}>{'\uD83E\uDEE7'}</Text>
            <Text style={styles.bubbleEmoji}>{'\uD83E\uDEE7'}</Text>
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
                <Feather name="plus" size={18} color="#023e8a" />
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
                <Feather name="trash-2" size={15} color="#c1121f" />
                <Text style={styles.deleteText}>Delete {pet.name}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer emoji row */}
          <View style={styles.footerRow}>
            <Text style={styles.footerEmoji}>{'\uD83D\uDC1A'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83E\uDD88'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83D\uDC19'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83D\uDC1F'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83D\uDC1A'}</Text>
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
    backgroundColor: '#0077b6',
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
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#023e8a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },

  // ── Wave banner ─────────────────────────────────────────
  waveBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 14,
  },
  waveBannerEmoji: {
    fontSize: 28,
  },

  // ── Title area ──────────────────────────────────────────
  titleArea: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#caf0f8',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    letterSpacing: 0.3,
  },

  // ── Profile card ────────────────────────────────────────
  profileCard: {
    backgroundColor: '#90e0ef',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#023e8a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
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
    backgroundColor: '#f0f4f8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#f4845f',
  },
  avatarText: {
    color: '#023e8a',
    fontSize: 22,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    color: '#023e8a',
    fontSize: 17,
    fontWeight: '700',
  },
  profileEmail: {
    color: '#0077b6',
    fontSize: 13,
    marginTop: 2,
    opacity: 0.8,
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#ffd6a5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
    gap: 4,
  },
  guestBadgeText: {
    color: '#023e8a',
    fontSize: 11,
    fontWeight: '600',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#caf0f8',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  signOutText: {
    color: '#0077b6',
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Hero card (with pet) ──────────────────────────────────
  heroCard: {
    backgroundColor: '#f4845f',
    borderRadius: 24,
    padding: 24,
    marginBottom: 8,
    shadowColor: '#023e8a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 6,
  },
  heroCardEmpty: {
    backgroundColor: '#00b4d8',
    borderRadius: 24,
    padding: 24,
    marginBottom: 8,
    shadowColor: '#023e8a',
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
  heroEmoji: {
    fontSize: 42,
    marginRight: 16,
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
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },

  // ── Bubble decoration ─────────────────────────────────────
  bubbleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 18,
    gap: 16,
  },
  bubbleEmoji: {
    fontSize: 20,
    opacity: 0.6,
  },

  // ── Bottom section ────────────────────────────────────────
  bottomSection: {
    gap: 14,
  },
  newPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#90e0ef',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
    shadowColor: '#023e8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  newPetButtonText: {
    color: '#023e8a',
    fontSize: 15,
    fontWeight: '700',
  },
  languageCard: {
    backgroundColor: '#ffd6a5',
    borderRadius: 24,
    padding: 14,
    shadowColor: '#023e8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 2,
  },
  deleteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,200,200,0.25)',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  deleteText: {
    color: '#ffc8c8',
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
