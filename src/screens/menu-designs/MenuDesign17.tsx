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

export const MenuDesign17: React.FC<Props> = ({ navigation }) => {
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
            <Feather name="arrow-left" size={22} color="#e63946" />
          </TouchableOpacity>

          {/* Toy banner */}
          <View style={styles.toyBanner}>
            <Text style={styles.toyBannerEmoji}>{'\uD83E\uDDF8'}</Text>
            <Text style={styles.toyBannerEmoji}>{'\uD83C\uDFB2'}</Text>
            <Text style={styles.toyBannerEmoji}>{'\uD83E\uDDF1'}</Text>
            <Text style={styles.toyBannerEmoji}>{'\uD83C\uDFA8'}</Text>
            <Text style={styles.toyBannerEmoji}>{'\uD83E\uDE80'}</Text>
            <Text style={styles.toyBannerEmoji}>{'\uD83E\uDDF8'}</Text>
          </View>

          {/* Title */}
          <View style={styles.titleArea}>
            <Text style={styles.title}>Pet Care</Text>
            <Text style={styles.subtitle}>Open the toy box! {'\uD83C\uDFAA'}</Text>
          </View>

          {/* Profile card */}
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatarSquare}>
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
                  <Feather name="log-out" size={14} color="#e63946" />
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
                    <Text style={styles.heroHint}>Let's build fun! {'\uD83E\uDDF1'}</Text>
                  </View>
                </View>
                <View style={styles.heroArrow}>
                  <Feather name="chevron-right" size={26} color="#ffffff" />
                </View>
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
                  <Text style={styles.heroEmoji}>{'\uD83E\uDDF1'}</Text>
                  <View style={styles.heroTextGroup}>
                    <Text style={styles.heroNameEmpty}>Build your buddy! {'\uD83C\uDFA8'}</Text>
                    <Text style={styles.heroHintEmpty}>{t('menu.createPetHint')}</Text>
                  </View>
                </View>
                <View style={styles.heroArrowEmpty}>
                  <Feather name="plus" size={26} color="#2a9d8f" />
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
                <Text style={styles.newPetEmoji}>{'\uD83C\uDFAA'}</Text>
                <Text style={styles.newPetText}>{t('menu.createPet')}</Text>
                <Feather name="plus-circle" size={20} color="#457b9d" />
              </View>
            </TouchableOpacity>
          )}

          {/* Block decoration */}
          <View style={styles.blockRow}>
            <View style={[styles.block, styles.blockRed]} />
            <View style={[styles.block, styles.blockBlue]} />
            <View style={[styles.block, styles.blockYellow]} />
            <View style={[styles.block, styles.blockGreen]} />
          </View>

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
                <Feather name="trash-2" size={15} color="#c1121f" />
                <Text style={styles.deleteText}>Delete {pet.name}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footerRow}>
            <Text style={styles.footerEmoji}>{'\uD83C\uDFB2'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83E\uDDF8'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83C\uDFAF'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83E\uDDF8'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83C\uDFB2'}</Text>
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
    backgroundColor: '#fef9ef',
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
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#e63946',
    shadowColor: '#1d3557',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },

  // ── Toy banner ──────────────────────────────────────────
  toyBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  toyBannerEmoji: {
    fontSize: 28,
  },

  // ── Title area ──────────────────────────────────────────
  titleArea: {
    alignItems: 'center',
    marginBottom: 26,
  },
  title: {
    color: '#e63946',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 2,
  },
  subtitle: {
    color: '#457b9d',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    letterSpacing: 0.3,
  },

  // ── Profile card ────────────────────────────────────────
  profileCard: {
    backgroundColor: '#f4a261',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#e63946',
    shadowColor: '#1d3557',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSquare: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#457b9d',
  },
  avatarText: {
    color: '#1d3557',
    fontSize: 24,
    fontWeight: '900',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    color: '#1d3557',
    fontSize: 18,
    fontWeight: '800',
  },
  profileEmail: {
    color: '#1d3557',
    fontSize: 13,
    marginTop: 2,
    opacity: 0.7,
    fontWeight: '500',
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#2a9d8f',
    borderRadius: 10,
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
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
    borderWidth: 2,
    borderColor: '#e63946',
  },
  signOutText: {
    color: '#e63946',
    fontSize: 13,
    fontWeight: '700',
  },

  // ── Hero card (with pet) ────────────────────────────────
  heroCard: {
    backgroundColor: '#457b9d',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#1d3557',
    shadowColor: '#1d3557',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  heroCardEmpty: {
    backgroundColor: '#2a9d8f',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#1d3557',
    shadowColor: '#1d3557',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
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
    fontSize: 52,
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
    color: '#f4a261',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
  heroNameEmpty: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  heroHintEmpty: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  heroArrow: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  heroArrowEmpty: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },

  // ── New pet card (secondary action) ─────────────────────
  newPetCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 8,
    borderWidth: 3,
    borderColor: '#457b9d',
    shadowColor: '#1d3557',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  newPetContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 44,
  },
  newPetEmoji: {
    fontSize: 22,
  },
  newPetText: {
    color: '#457b9d',
    fontSize: 16,
    fontWeight: '800',
  },

  // ── Block decoration ────────────────────────────────────
  blockRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  block: {
    width: 24,
    height: 24,
    borderRadius: 4,
    shadowColor: '#1d3557',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  blockRed: {
    backgroundColor: '#e63946',
  },
  blockBlue: {
    backgroundColor: '#457b9d',
  },
  blockYellow: {
    backgroundColor: '#f4a261',
  },
  blockGreen: {
    backgroundColor: '#2a9d8f',
  },

  // ── Bottom section ──────────────────────────────────────
  bottomSection: {
    gap: 14,
  },
  languageCard: {
    backgroundColor: '#f4a261',
    borderRadius: 14,
    padding: 14,
    borderWidth: 3,
    borderColor: '#e76f51',
    shadowColor: '#1d3557',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  deleteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff0f0',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
    borderWidth: 3,
    borderColor: '#e6a0a0',
    shadowColor: '#c1121f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  deleteText: {
    color: '#c1121f',
    fontSize: 14,
    fontWeight: '600',
  },

  // ── Footer ──────────────────────────────────────────────
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    gap: 16,
  },
  footerEmoji: {
    fontSize: 24,
    opacity: 0.7,
  },
});
