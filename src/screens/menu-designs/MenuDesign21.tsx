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

export const MenuDesign21: React.FC<Props> = ({ navigation }) => {
  const menu = useMenuLogic(navigation);
  const { pet, user, isGuest, t } = menu;

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

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
            <Feather name="arrow-left" size={22} color="#7ec8e3" />
          </TouchableOpacity>

          {/* Cloud decoration */}
          <View style={styles.cloudDecoration}>
            <View style={styles.cloudDot} />
            <View style={[styles.cloudDot, styles.cloudDotMedium]} />
            <View style={styles.cloudDot} />
          </View>

          {/* Title */}
          <View style={styles.titleArea}>
            <Text style={styles.title}>Pet Care</Text>
            <Text style={styles.subtitle}>Your cozy companion</Text>
          </View>

          {/* Profile card */}
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatarCircle}>
                {user?.name ? (
                  <Text style={styles.avatarText}>{userInitial}</Text>
                ) : (
                  <Feather name="user" size={22} color="#ffffff" />
                )}
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {user?.name ?? t('menu.guest')}
                </Text>
                <Text style={styles.profileEmail} numberOfLines={1}>
                  {user?.email ?? t('menu.noEmail')}
                </Text>
                {isGuest && (
                  <View style={styles.guestBadge}>
                    <Feather name="cloud" size={10} color="#8b6fad" />
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
                  <Feather name="log-out" size={15} color="#aaaaaa" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Hero card */}
          {pet ? (
            <TouchableOpacity
              style={styles.heroCard}
              onPress={menu.handleContinue}
              activeOpacity={0.85}
              accessibilityLabel={`Continue with ${pet.name}`}
              accessibilityRole="button"
            >
              <View style={styles.heroContent}>
                <View style={styles.heroIconContainer}>
                  <Feather name="heart" size={28} color="#ffffff" />
                </View>
                <View style={styles.heroTextGroup}>
                  <Text style={styles.heroName}>{pet.name}</Text>
                  <Text style={styles.heroHint}>Continue playing</Text>
                </View>
                <Feather name="chevron-right" size={24} color="rgba(255,255,255,0.6)" />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.heroCardEmpty}
              onPress={menu.handleNewPet}
              activeOpacity={0.85}
              accessibilityLabel="Create a new pet"
              accessibilityRole="button"
            >
              <View style={styles.heroContent}>
                <View style={styles.heroIconContainerEmpty}>
                  <Feather name="plus-circle" size={28} color="#ffffff" />
                </View>
                <View style={styles.heroTextGroup}>
                  <Text style={styles.heroNameEmpty}>Create your pet</Text>
                  <Text style={styles.heroHintEmpty}>{t('menu.createPetHint')}</Text>
                </View>
                <Feather name="chevron-right" size={24} color="rgba(255,255,255,0.6)" />
              </View>
            </TouchableOpacity>
          )}

          {/* New pet button (secondary, shown when pet exists) */}
          {pet && (
            <TouchableOpacity
              style={styles.newPetButton}
              onPress={menu.handleNewPet}
              activeOpacity={0.8}
              accessibilityLabel="Create a new pet"
              accessibilityRole="button"
            >
              <Feather name="plus" size={18} color="#7ec8e3" />
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
                <Feather name="trash-2" size={14} color="#e88a8a" />
                <Text style={styles.deleteText}>Delete {pet.name}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer cloud dots */}
          <View style={styles.footer}>
            <View style={styles.footerDot} />
            <View style={[styles.footerDot, styles.footerDotLarge]} />
            <View style={styles.footerDot} />
            <View style={[styles.footerDot, styles.footerDotLarge]} />
            <View style={styles.footerDot} />
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
    backgroundColor: '#e8f4fd',
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
    shadowColor: '#b0d4e8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },

  // ── Cloud decoration ────────────────────────────────────
  cloudDecoration: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  cloudDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ffffff',
    opacity: 0.7,
  },
  cloudDotMedium: {
    width: 22,
    height: 22,
    borderRadius: 11,
    opacity: 0.5,
  },

  // ── Title area ──────────────────────────────────────────
  titleArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#8b6fad',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#aaaaaa',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 6,
    letterSpacing: 0.3,
  },

  // ── Profile card ────────────────────────────────────────
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 22,
    marginBottom: 20,
    shadowColor: '#b0d4e8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#b8dff0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 21,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    color: '#3a3a3a',
    fontSize: 17,
    fontWeight: '700',
  },
  profileEmail: {
    color: '#7a7a7a',
    fontSize: 13,
    marginTop: 2,
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#ede6f5',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
    gap: 5,
  },
  guestBadgeText: {
    color: '#8b6fad',
    fontSize: 11,
    fontWeight: '600',
  },
  signOutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Hero card ───────────────────────────────────────────
  heroCard: {
    backgroundColor: '#7ec8e3',
    borderRadius: 28,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#7ec8e3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 5,
  },
  heroCardEmpty: {
    backgroundColor: '#c3aed6',
    borderRadius: 28,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#c3aed6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 5,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  heroIconContainerEmpty: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
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
  heroNameEmpty: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  heroHint: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  heroHintEmpty: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },

  // ── New pet button ──────────────────────────────────────
  newPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
    shadowColor: '#b0d4e8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 3,
  },
  newPetButtonText: {
    color: '#7ec8e3',
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Bottom section ──────────────────────────────────────
  bottomSection: {
    gap: 14,
  },
  languageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 16,
    shadowColor: '#b0d4e8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 3,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
  },
  deleteText: {
    color: '#e88a8a',
    fontSize: 14,
    fontWeight: '500',
  },

  // ── Footer ──────────────────────────────────────────────
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    gap: 10,
  },
  footerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#c3aed6',
    opacity: 0.4,
  },
  footerDotLarge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#7ec8e3',
    opacity: 0.3,
  },
});
