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

export const MenuDesign24: React.FC<Props> = ({ navigation }) => {
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
            <Feather name="arrow-left" size={22} color="#e8e8e0" />
          </TouchableOpacity>

          {/* Chalk border frame around title */}
          <View style={styles.chalkFrame}>
            <View style={styles.titleArea}>
              <Text style={styles.title}>Pet Care</Text>
              <Text style={styles.subtitle}>Let's learn & play</Text>
            </View>
          </View>

          {/* Chalk line separator */}
          <View style={styles.chalkLineSeparator} />

          {/* Profile card */}
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{userInitial}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {user?.name ?? t('menu.guest')}
                </Text>
                {isGuest && (
                  <View style={styles.guestBadge}>
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
                  <Feather name="log-out" size={15} color="#f0b8b8" />
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
                <View style={styles.heroIconContainer}>
                  <Feather name="heart" size={36} color="#f0b8b8" />
                </View>
                <View style={styles.heroTextGroup}>
                  <Text style={styles.heroName}>{pet.name}</Text>
                  <Text style={styles.heroHint}>Continue</Text>
                </View>
                <Feather name="chevron-right" size={24} color="#e8e8e0" />
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
                <View style={styles.heroIconContainerEmpty}>
                  <Feather name="edit" size={32} color="#f5e6a3" />
                </View>
                <View style={styles.heroTextGroup}>
                  <Text style={styles.heroNameEmpty}>Start drawing your pet</Text>
                  <Text style={styles.heroHintEmpty}>{t('menu.createPetHint')}</Text>
                </View>
                <Feather name="chevron-right" size={24} color="#f5e6a3" />
              </View>
            </TouchableOpacity>
          )}

          {/* New pet button (when pet exists) */}
          {pet && (
            <TouchableOpacity
              style={styles.newPetButton}
              onPress={menu.handleNewPet}
              activeOpacity={0.8}
              accessibilityLabel="Create a new pet"
              accessibilityRole="button"
            >
              <Feather name="plus" size={18} color="#b5d9a3" />
              <Text style={styles.newPetButtonText}>{t('menu.createPet')}</Text>
            </TouchableOpacity>
          )}

          {/* Chalk line separator */}
          <View style={styles.chalkLineSeparator} />

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
                <Feather name="trash-2" size={14} color="#f0b8b8" />
                <Text style={styles.deleteText}>Delete {pet.name}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Chalk dust footer decoration */}
          <View style={styles.footer}>
            <View style={styles.chalkDotRow}>
              <View style={[styles.chalkDot, { backgroundColor: '#f5e6a3' }]} />
              <View style={[styles.chalkDot, { backgroundColor: '#a8d4e6' }]} />
              <View style={[styles.chalkDot, { backgroundColor: '#f0b8b8' }]} />
              <View style={[styles.chalkDot, { backgroundColor: '#b5d9a3' }]} />
              <View style={[styles.chalkDot, { backgroundColor: '#e8e8e0' }]} />
            </View>
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
    backgroundColor: '#2d4a3e',
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
    borderWidth: 1.5,
    borderColor: '#e8e8e0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  // ── Chalk frame ─────────────────────────────────────────
  chalkFrame: {
    borderWidth: 2,
    borderColor: '#e8e8e0',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },

  // ── Title area ──────────────────────────────────────────
  titleArea: {
    alignItems: 'center',
  },
  title: {
    color: '#f5e6a3',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 2,
  },
  subtitle: {
    color: '#e8e8e0',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
    letterSpacing: 0.5,
  },

  // ── Chalk line separator ────────────────────────────────
  chalkLineSeparator: {
    height: 0,
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e8e8e0',
    marginBottom: 20,
    opacity: 0.5,
  },

  // ── Profile card ────────────────────────────────────────
  profileCard: {
    backgroundColor: '#345a4d',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#e8e8e0',
    borderStyle: 'dashed',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#a8d4e6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#2d4a3e',
    fontSize: 20,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    color: '#e8e8e0',
    fontSize: 17,
    fontWeight: '700',
  },
  guestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0b8b8',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
  },
  guestBadgeText: {
    color: '#2d4a3e',
    fontSize: 11,
    fontWeight: '700',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#f0b8b8',
    borderStyle: 'dashed',
    gap: 6,
  },
  signOutText: {
    color: '#f0b8b8',
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Hero card (pet exists) ──────────────────────────────
  heroCard: {
    backgroundColor: '#345a4d',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#a8d4e6',
  },
  heroCardEmpty: {
    backgroundColor: '#345a4d',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#f5e6a3',
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#f0b8b8',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  heroIconContainerEmpty: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#f5e6a3',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  heroTextGroup: {
    flex: 1,
  },
  heroName: {
    color: '#e8e8e0',
    fontSize: 22,
    fontWeight: '800',
  },
  heroHint: {
    color: '#b5d9a3',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  heroNameEmpty: {
    color: '#f5e6a3',
    fontSize: 18,
    fontWeight: '800',
  },
  heroHintEmpty: {
    color: '#e8e8e0',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
    opacity: 0.7,
  },

  // ── New pet button ──────────────────────────────────────
  newPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#345a4d',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#b5d9a3',
    borderStyle: 'dashed',
    gap: 8,
  },
  newPetButtonText: {
    color: '#b5d9a3',
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Bottom section ──────────────────────────────────────
  bottomSection: {
    gap: 14,
  },
  languageCard: {
    backgroundColor: '#345a4d',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#e8e8e0',
    borderStyle: 'dashed',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#f0b8b8',
    borderStyle: 'dashed',
    gap: 6,
  },
  deleteText: {
    color: '#f0b8b8',
    fontSize: 14,
    fontWeight: '500',
  },

  // ── Footer ──────────────────────────────────────────────
  footer: {
    alignItems: 'center',
    marginTop: 28,
  },
  chalkDotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
  },
  chalkDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    opacity: 0.6,
  },
});
