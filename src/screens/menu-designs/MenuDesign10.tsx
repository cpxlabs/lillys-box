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

export const MenuDesign10: React.FC<Props> = ({ navigation }) => {
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
            <Feather name="arrow-left" size={22} color="#283618" />
          </TouchableOpacity>

          {/* Decorative nature banner */}
          <View style={styles.natureBanner}>
            <Text style={styles.natureBannerEmoji}>{'\uD83C\uDF3F'}</Text>
            <Text style={styles.natureBannerEmoji}>{'\uD83C\uDF33'}</Text>
            <Text style={styles.natureBannerEmoji}>{'\uD83C\uDF3B'}</Text>
            <Text style={styles.natureBannerEmoji}>{'\uD83C\uDF3F'}</Text>
            <Text style={styles.natureBannerEmoji}>{'\uD83C\uDF33'}</Text>
            <Text style={styles.natureBannerEmoji}>{'\uD83C\uDF3B'}</Text>
          </View>

          {/* Profile card */}
          <View style={styles.profileCard}>
            <View style={styles.profileLeftBorder} />
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
                      <Feather name="user" size={10} color="#283618" />
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
                    <Feather name="log-out" size={15} color="#606c38" />
                    <Text style={styles.signOutText}>Sign Out</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Title area */}
          <View style={styles.titleArea}>
            <Text style={styles.title}>
              {'\uD83C\uDF3F'} Pet Care {'\uD83C\uDF3F'}
            </Text>
            <Text style={styles.subtitle}>{t('menu.subtitle')}</Text>
            {/* Decorative vine separator */}
            <View style={styles.vineSeparator}>
              <View style={styles.vineDot} />
              <View style={styles.vineDash} />
              <View style={styles.vineDot} />
              <View style={styles.vineDash} />
              <View style={styles.vineLeaf}>
                <Text style={styles.vineLeafEmoji}>{'\uD83C\uDF43'}</Text>
              </View>
              <View style={styles.vineDash} />
              <View style={styles.vineDot} />
              <View style={styles.vineDash} />
              <View style={styles.vineDot} />
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
                    {'\uD83C\uDF3B'}{petEmoji}
                  </Text>
                  <View style={styles.heroTextGroup}>
                    <Text style={styles.heroName}>{pet.name}</Text>
                    <Text style={styles.heroHint}>Continue your garden adventure</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={24} color="rgba(255,255,255,0.7)" />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.heroCard}
              onPress={menu.handleNewPet}
              activeOpacity={0.8}
              accessibilityLabel="Create a new pet"
              accessibilityRole="button"
            >
              <View style={styles.heroContent}>
                <View style={styles.heroLeft}>
                  <Text style={styles.heroEmoji}>{'\uD83C\uDF31'}</Text>
                  <View style={styles.heroTextGroup}>
                    <Text style={styles.heroName}>Plant a new companion</Text>
                    <Text style={styles.heroHint}>{t('menu.createPetHint')}</Text>
                  </View>
                </View>
                <Feather name="plus-circle" size={24} color="rgba(255,255,255,0.7)" />
              </View>
            </TouchableOpacity>
          )}

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
                <Feather name="plus" size={18} color="#283618" />
                <Text style={styles.newPetButtonText}>{t('menu.createPet')}</Text>
              </TouchableOpacity>
            )}

            {/* Delete pet */}
            {pet && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={menu.handleDeletePet}
                accessibilityLabel="Delete pet"
                accessibilityRole="button"
              >
                <Text style={styles.deleteWarningLeaf}>{'\u26A0\uFE0F'}</Text>
                <Text style={styles.deleteText}>Delete {pet.name}</Text>
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
    backgroundColor: '#fefae0',
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
    backgroundColor: '#e9edc9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#bc6c25',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  // ── Nature banner ───────────────────────────────────────
  natureBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  natureBannerEmoji: {
    fontSize: 22,
    opacity: 0.7,
  },

  // ── Profile card ────────────────────────────────────────
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#fefcf3',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 28,
    shadowColor: '#bc6c25',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  profileLeftBorder: {
    width: 4,
    backgroundColor: '#bc6c25',
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
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e9edc9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#606c38',
  },
  avatarText: {
    color: '#283618',
    fontSize: 20,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    color: '#283618',
    fontSize: 16,
    fontWeight: '700',
  },
  profileEmail: {
    color: '#bc6c25',
    fontSize: 13,
    marginTop: 2,
    opacity: 0.8,
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#dda15e',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
    gap: 4,
  },
  guestBadgeText: {
    color: '#283618',
    fontSize: 11,
    fontWeight: '600',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9edc9',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  signOutText: {
    color: '#606c38',
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Title area ──────────────────────────────────────────
  titleArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#606c38',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#bc6c25',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 8,
    letterSpacing: 0.3,
  },

  // ── Vine separator ──────────────────────────────────────
  vineSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    gap: 4,
  },
  vineDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#606c38',
    opacity: 0.4,
  },
  vineDash: {
    width: 14,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#606c38',
    opacity: 0.25,
  },
  vineLeaf: {
    marginHorizontal: 2,
  },
  vineLeafEmoji: {
    fontSize: 14,
  },

  // ── Hero card ───────────────────────────────────────────
  heroCard: {
    backgroundColor: '#606c38',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#bc6c25',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
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
    fontSize: 36,
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
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },

  // ── Bottom section ──────────────────────────────────────
  bottomSection: {
    gap: 14,
  },
  languageCard: {
    backgroundColor: '#e9edc9',
    borderRadius: 20,
    padding: 14,
    shadowColor: '#bc6c25',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  newPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dda15e',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
    shadowColor: '#bc6c25',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  newPetButtonText: {
    color: '#283618',
    fontSize: 15,
    fontWeight: '700',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  deleteWarningLeaf: {
    fontSize: 14,
  },
  deleteText: {
    color: '#ae2012',
    fontSize: 14,
    fontWeight: '500',
  },
});
