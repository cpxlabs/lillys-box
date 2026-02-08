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

export const MenuDesign22: React.FC<Props> = ({ navigation }) => {
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
            <Feather name="chevron-left" size={24} color="#c97b5a" />
          </TouchableOpacity>

          {/* Title area */}
          <View style={styles.titleArea}>
            <Text style={styles.title}>Pet Care</Text>
            <Text style={styles.subtitle}>A gentle adventure</Text>
          </View>

          {/* Painted stroke separator */}
          <View style={styles.strokeSeparatorContainer}>
            <View style={styles.strokeSeparator} />
          </View>

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
                  <Feather name="log-out" size={16} color="#c97b5a" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Painted stroke separator */}
          <View style={styles.strokeSeparatorContainer}>
            <View style={styles.strokeSeparatorBlue} />
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
                <View style={styles.heroIconCircle}>
                  <Feather name="heart" size={24} color="#ffffff" />
                </View>
                <View style={styles.heroTextGroup}>
                  <Text style={styles.heroName}>{pet.name}</Text>
                  <Text style={styles.heroHint}>Keep exploring</Text>
                </View>
                <Feather name="chevron-right" size={22} color="#3d3d3d" />
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
                <View style={styles.heroIconCircleEmpty}>
                  <Feather name="plus" size={24} color="#ffffff" />
                </View>
                <View style={styles.heroTextGroup}>
                  <Text style={styles.heroNameEmpty}>Start your journey</Text>
                  <Text style={styles.heroHintEmpty}>{t('menu.createPetHint')}</Text>
                </View>
                <Feather name="chevron-right" size={22} color="#3d3d3d" />
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
              <Feather name="plus" size={18} color="#c97b5a" />
              <Text style={styles.newPetButtonText}>{t('menu.createPet')}</Text>
            </TouchableOpacity>
          )}

          {/* Painted stroke separator */}
          <View style={styles.strokeSeparatorContainer}>
            <View style={styles.strokeSeparatorGreen} />
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
                style={styles.deleteButton}
                onPress={menu.handleDeletePet}
                accessibilityLabel="Delete pet"
                accessibilityRole="button"
              >
                <Feather name="trash-2" size={14} color="#c97070" />
                <Text style={styles.deleteText}>Delete {pet.name}</Text>
              </TouchableOpacity>
            )}
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
    backgroundColor: '#faf8f5',
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(201, 123, 90, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#d4c5b3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },

  // ── Title area ────────────────────────────────────────────
  titleArea: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#c97b5a',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#8a9a7b',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 6,
    letterSpacing: 0.3,
    fontStyle: 'italic',
  },

  // ── Stroke separators ──────────────────────────────────────
  strokeSeparatorContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  strokeSeparator: {
    width: 60,
    height: 2,
    backgroundColor: '#f4c2c2',
    borderRadius: 1,
  },
  strokeSeparatorBlue: {
    width: 60,
    height: 2,
    backgroundColor: '#b5d8eb',
    borderRadius: 1,
  },
  strokeSeparatorGreen: {
    width: 60,
    height: 2,
    backgroundColor: '#c1e1c1',
    borderRadius: 1,
  },

  // ── Profile card ──────────────────────────────────────────
  profileCard: {
    backgroundColor: '#fde9b0',
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#d4c5b3',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#b5d8eb',
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
    color: '#3d3d3d',
    fontSize: 17,
    fontWeight: '600',
  },
  guestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#c1e1c1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 6,
  },
  guestBadgeText: {
    color: '#3d3d3d',
    fontSize: 11,
    fontWeight: '600',
  },
  signOutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(201, 123, 90, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Hero card ─────────────────────────────────────────────
  heroCard: {
    backgroundColor: '#b5d8eb',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#d4c5b3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  heroCardEmpty: {
    backgroundColor: '#c1e1c1',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#d4c5b3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  heroIconCircleEmpty: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  heroTextGroup: {
    flex: 1,
  },
  heroName: {
    color: '#3d3d3d',
    fontSize: 20,
    fontWeight: '700',
  },
  heroNameEmpty: {
    color: '#3d3d3d',
    fontSize: 20,
    fontWeight: '700',
  },
  heroHint: {
    color: 'rgba(61, 61, 61, 0.7)',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  heroHintEmpty: {
    color: 'rgba(61, 61, 61, 0.7)',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },

  // ── New pet button ────────────────────────────────────────
  newPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(201, 123, 90, 0.1)',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  newPetButtonText: {
    color: '#c97b5a',
    fontSize: 15,
    fontWeight: '600',
  },

  // ── Bottom section ────────────────────────────────────────
  bottomSection: {
    gap: 14,
  },
  languageCard: {
    backgroundColor: '#f4c2c2',
    borderRadius: 22,
    padding: 16,
    shadowColor: '#d4c5b3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 6,
  },
  deleteText: {
    color: '#c97070',
    fontSize: 14,
    fontWeight: '500',
  },
});
