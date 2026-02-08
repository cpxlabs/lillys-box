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

export const MenuDesign15: React.FC<Props> = ({ navigation }) => {
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
            <Feather name="arrow-left" size={22} color="#2d6a4f" />
          </TouchableOpacity>

          {/* Jungle banner */}
          <View style={styles.jungleBanner}>
            <Text style={styles.bannerEmoji}>{'\uD83C\uDF34'}</Text>
            <Text style={styles.bannerEmoji}>{'\uD83E\uDD81'}</Text>
            <Text style={styles.bannerEmoji}>{'\uD83D\uDC12'}</Text>
            <Text style={styles.bannerEmoji}>{'\uD83E\uDD9C'}</Text>
            <Text style={styles.bannerEmoji}>{'\uD83C\uDF3A'}</Text>
            <Text style={styles.bannerEmoji}>{'\uD83C\uDF34'}</Text>
          </View>

          {/* Title */}
          <View style={styles.titleArea}>
            <Text style={styles.title}>
              {'\uD83D\uDC3E'} Pet Care
            </Text>
            <Text style={styles.subtitle}>
              Welcome to the jungle! {'\uD83C\uDF34'}
            </Text>
          </View>

          {/* Profile card */}
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatarContainer}>
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
                  <Feather name="log-out" size={15} color="#2d6a4f" />
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
                  <Text style={styles.heroEmoji}>
                    {petEmoji}
                  </Text>
                  <Text style={styles.heroPawPrints}>
                    {'\uD83D\uDC3E'}{'\uD83D\uDC3E'}
                  </Text>
                </View>
                <View style={styles.heroTextGroup}>
                  <Text style={styles.heroName}>{pet.name}</Text>
                  <Text style={styles.heroHint}>
                    Let's explore! {'\uD83C\uDF43'}
                  </Text>
                </View>
                <Feather name="chevron-right" size={26} color="rgba(255,255,255,0.7)" />
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
                  <Feather name="search" size={28} color="rgba(255,255,255,0.85)" />
                </View>
                <View style={styles.heroTextGroup}>
                  <Text style={styles.heroName}>
                    Find your wild friend! {'\uD83E\uDD81'}
                  </Text>
                  <Text style={styles.heroHint}>{t('menu.createPetHint')}</Text>
                </View>
                <Feather name="plus-circle" size={26} color="rgba(255,255,255,0.7)" />
              </View>
            </TouchableOpacity>
          )}

          {/* Vine decoration */}
          <View style={styles.vineDecoration}>
            <Text style={styles.vineEmoji}>{'\uD83C\uDF43'}</Text>
            <Text style={styles.vineEmoji}>{'\uD83C\uDF3A'}</Text>
            <Text style={styles.vineEmoji}>{'\uD83C\uDF43'}</Text>
            <Text style={styles.vineEmoji}>{'\uD83C\uDF3A'}</Text>
            <Text style={styles.vineEmoji}>{'\uD83C\uDF43'}</Text>
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
              <Feather name="plus" size={18} color="#3d2c1e" />
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
                <Feather name="trash-2" size={14} color="#774936" />
                <Text style={styles.deleteText}>Delete {pet.name}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerEmoji}>{'\uD83D\uDC12'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83C\uDF34'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83E\uDD9C'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83C\uDF34'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83D\uDC12'}</Text>
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
    backgroundColor: '#d4edda',
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
    backgroundColor: 'rgba(45, 106, 79, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#774936',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  // ── Jungle banner ───────────────────────────────────────
  jungleBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  bannerEmoji: {
    fontSize: 28,
  },

  // ── Title area ──────────────────────────────────────────
  titleArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#2d6a4f',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#774936',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
    letterSpacing: 0.3,
  },

  // ── Profile card ────────────────────────────────────────
  profileCard: {
    backgroundColor: '#f9dc5c',
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#774936',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    padding: 3,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#2d6a4f',
    backgroundColor: '#d4edda',
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#2d6a4f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    color: '#3d2c1e',
    fontSize: 17,
    fontWeight: '700',
  },
  profileEmail: {
    color: '#774936',
    fontSize: 13,
    marginTop: 2,
    opacity: 0.75,
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#2d6a4f',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 106, 79, 0.15)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  signOutText: {
    color: '#2d6a4f',
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Hero card ───────────────────────────────────────────
  heroCard: {
    backgroundColor: '#2d6a4f',
    borderRadius: 22,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#774936',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
  },
  heroCardEmpty: {
    backgroundColor: '#f4845f',
    borderRadius: 22,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#774936',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  heroEmoji: {
    fontSize: 44,
  },
  heroPawPrints: {
    fontSize: 16,
    marginTop: 2,
  },
  heroTextGroup: {
    flex: 1,
  },
  heroName: {
    color: '#ffffff',
    fontSize: 21,
    fontWeight: '700',
  },
  heroHint: {
    color: '#a7e8bd',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },

  // ── Vine decoration ─────────────────────────────────────
  vineDecoration: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 14,
  },
  vineEmoji: {
    fontSize: 20,
    opacity: 0.7,
  },

  // ── New pet button ──────────────────────────────────────
  newPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9dc5c',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
    shadowColor: '#774936',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  newPetButtonText: {
    color: '#3d2c1e',
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Bottom section ──────────────────────────────────────
  bottomSection: {
    gap: 14,
  },
  languageCard: {
    backgroundColor: '#a2d2ff',
    borderRadius: 22,
    padding: 14,
    shadowColor: '#774936',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(119, 73, 54, 0.1)',
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
  },
  deleteText: {
    color: '#774936',
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
    fontSize: 22,
    opacity: 0.6,
  },
});
