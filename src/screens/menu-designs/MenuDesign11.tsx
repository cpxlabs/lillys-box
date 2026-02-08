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

export const MenuDesign11: React.FC<Props> = ({ navigation }) => {
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
            <Feather name="arrow-left" size={22} color="#ff69b4" />
          </TouchableOpacity>

          {/* Decorative candy banner */}
          <View style={styles.candyBanner}>
            <Text style={styles.candyBannerEmoji}>{'\uD83C\uDF6D'}</Text>
            <Text style={styles.candyBannerEmoji}>{'\uD83C\uDF6C'}</Text>
            <Text style={styles.candyBannerEmoji}>{'\uD83E\uDDC1'}</Text>
            <Text style={styles.candyBannerEmoji}>{'\uD83C\uDF69'}</Text>
            <Text style={styles.candyBannerEmoji}>{'\uD83C\uDF6D'}</Text>
          </View>

          {/* Title area */}
          <View style={styles.titleArea}>
            <Text style={styles.title}>
              {'\uD83C\uDF80'} Pet Care {'\uD83C\uDF80'}
            </Text>
            <Text style={styles.subtitle}>
              {'\uD83C\uDF6C'} {t('menu.subtitle')} {'\uD83C\uDF6C'}
            </Text>
          </View>

          {/* Profile card */}
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{userInitial}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {user?.email ? user.email.split('@')[0] : t('menu.guest')} {'\uD83C\uDF6D'}
                </Text>
                <Text style={styles.profileEmail} numberOfLines={1}>
                  {user?.email ?? t('menu.noEmail')}
                </Text>
                {isGuest && (
                  <View style={styles.guestBadge}>
                    <Text style={styles.guestBadgeEmoji}>{'\uD83C\uDF6C'}</Text>
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
                  <Feather name="log-out" size={14} color="#d663e5" />
                  <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
              )}
            </View>
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
                    <Text style={styles.heroHint}>Let's play! {'\uD83C\uDF6D'}</Text>
                  </View>
                </View>
                <View style={styles.heroArrowContinue}>
                  <Feather name="chevron-right" size={28} color="#ffffff" />
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
                    <Text style={styles.heroNameCreate}>Create your sweet pet! {'\uD83E\uDDC1'}</Text>
                    <Text style={styles.heroHintCreate}>{t('menu.createPetHint')}</Text>
                  </View>
                </View>
                <View style={styles.heroArrowCreate}>
                  <Feather name="plus" size={28} color="#8B6914" />
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
                <Text style={styles.newPetEmoji}>{'\uD83E\uDDC1'}</Text>
                <Text style={styles.newPetText}>{t('menu.createPet')}</Text>
                <Feather name="plus-circle" size={22} color="#ff69b4" />
              </View>
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
                style={styles.deleteCard}
                onPress={menu.handleDeletePet}
                accessibilityLabel="Delete pet"
                accessibilityRole="button"
              >
                <Feather name="trash-2" size={16} color="#d44" />
                <Text style={styles.deleteText}>Delete {pet.name}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Candy decorative footer */}
          <View style={styles.candyFooter}>
            <Text style={styles.candyFooterEmoji}>{'\uD83C\uDF6C'}</Text>
            <Text style={styles.candyFooterEmoji}>{'\uD83C\uDF69'}</Text>
            <Text style={styles.candyFooterEmoji}>{'\uD83E\uDDC1'}</Text>
            <Text style={styles.candyFooterEmoji}>{'\uD83C\uDF6D'}</Text>
            <Text style={styles.candyFooterEmoji}>{'\uD83C\uDF6C'}</Text>
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
    backgroundColor: '#ffe0f0',
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
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#ffb6c1',
    shadowColor: '#ff69b4',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },

  // ── Candy banner ────────────────────────────────────────
  candyBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 14,
  },
  candyBannerEmoji: {
    fontSize: 28,
  },

  // ── Title area ──────────────────────────────────────────
  titleArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#ff69b4',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#d663e5',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
    letterSpacing: 0.3,
  },

  // ── Profile card ────────────────────────────────────────
  profileCard: {
    backgroundColor: '#ffb6c1',
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#ff69b4',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#d663e5',
  },
  avatarText: {
    color: '#d663e5',
    fontSize: 26,
    fontWeight: '900',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  profileEmail: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#a8e6cf',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 8,
    gap: 4,
  },
  guestBadgeEmoji: {
    fontSize: 12,
  },
  guestBadgeText: {
    color: '#2d6a4f',
    fontSize: 12,
    fontWeight: '700',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },
  signOutText: {
    color: '#d663e5',
    fontSize: 13,
    fontWeight: '700',
  },

  // ── Hero card (continue with pet) ──────────────────────
  heroCardContinue: {
    backgroundColor: '#d663e5',
    borderRadius: 28,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#d663e5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
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
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  heroHint: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
  heroArrowContinue: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Hero card (create new pet) ─────────────────────────
  heroCardCreate: {
    backgroundColor: '#fff3b0',
    borderRadius: 28,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#ffd54f',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 5,
  },
  heroNameCreate: {
    color: '#5a4000',
    fontSize: 20,
    fontWeight: '800',
  },
  heroHintCreate: {
    color: '#8B6914',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    opacity: 0.8,
  },
  heroArrowCreate: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── New pet card (secondary action) ────────────────────
  newPetCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#ffb6c1',
    shadowColor: '#ff69b4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  newPetContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 48,
  },
  newPetEmoji: {
    fontSize: 24,
  },
  newPetText: {
    color: '#ff69b4',
    fontSize: 17,
    fontWeight: '800',
  },

  // ── Bottom section ─────────────────────────────────────
  bottomSection: {
    gap: 14,
  },
  languageCard: {
    backgroundColor: '#a8e6cf',
    borderRadius: 28,
    padding: 14,
    shadowColor: '#a8e6cf',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  deleteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffb3b3',
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
    shadowColor: '#ffb3b3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  deleteText: {
    color: '#d44',
    fontSize: 13,
    fontWeight: '600',
  },

  // ── Candy footer ───────────────────────────────────────
  candyFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    gap: 14,
  },
  candyFooterEmoji: {
    fontSize: 24,
    opacity: 0.7,
  },
});
