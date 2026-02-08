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

export const MenuDesign26: React.FC<Props> = ({ navigation }) => {
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
            <Feather name="arrow-left" size={22} color="#2c3e6b" />
          </TouchableOpacity>

          {/* Book title frame — decorative double border */}
          <View style={styles.outerFrame}>
            <View style={styles.innerFrame}>
              <Text style={styles.title}>Pet Care</Text>
              <Text style={styles.subtitle}>Once upon a time...</Text>
            </View>
          </View>

          {/* Chapter divider — three gold dots */}
          <View style={styles.dotDivider}>
            <View style={styles.goldDot} />
            <View style={styles.goldDot} />
            <View style={styles.goldDot} />
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
                  <Feather name="bookmark" size={16} color="#2c3e6b" />
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
                <Feather name="book-open" size={24} color="#d4a338" />
                <View style={styles.heroTextGroup}>
                  <Text style={styles.heroPetName}>{pet.name}</Text>
                  <Text style={styles.heroHint}>Turn the page</Text>
                </View>
                <Feather name="chevron-right" size={22} color="#d4a338" />
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
                <Feather name="edit-3" size={24} color="#d4a338" />
                <View style={styles.heroTextGroup}>
                  <Text style={styles.heroEmptyTitle}>Begin your story</Text>
                  <Text style={styles.heroEmptyHint}>{t('menu.createPetHint')}</Text>
                </View>
                <Feather name="chevron-right" size={22} color="#d4a338" />
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
              <Feather name="plus" size={18} color="#2c3e6b" />
              <Text style={styles.newPetButtonText}>{t('menu.createPet')}</Text>
            </TouchableOpacity>
          )}

          {/* Chapter divider — three gold dots */}
          <View style={styles.dotDivider}>
            <View style={styles.goldDot} />
            <View style={styles.goldDot} />
            <View style={styles.goldDot} />
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
                <Feather name="trash-2" size={14} color="#c0392b" />
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
    backgroundColor: '#fdf5e6',
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
    borderWidth: 2,
    borderColor: '#2c3e6b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#fdf5e6',
  },

  // ── Book title double-border frame ──────────────────────
  outerFrame: {
    borderWidth: 3,
    borderColor: '#2c3e6b',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  innerFrame: {
    borderWidth: 1,
    borderColor: '#d4a338',
    borderRadius: 10,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#fdf5e6',
  },
  title: {
    color: '#2c3e6b',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#8a7a5a',
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'italic',
    marginTop: 8,
  },

  // ── Gold dot divider ────────────────────────────────────
  dotDivider: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  goldDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d4a338',
  },

  // ── Profile card ────────────────────────────────────────
  profileCard: {
    backgroundColor: '#fdf5e6',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2c3e6b',
    padding: 18,
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2c3e6b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#d4a338',
    fontSize: 20,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    color: '#2c3e6b',
    fontSize: 17,
    fontWeight: '700',
  },
  guestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#3d7b5f',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
  },
  guestBadgeText: {
    color: '#fdf5e6',
    fontSize: 11,
    fontWeight: '700',
  },
  signOutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#2c3e6b',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fdf5e6',
  },

  // ── Hero card (pet exists) ──────────────────────────────
  heroCard: {
    backgroundColor: '#2c3e6b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d4a338',
    padding: 20,
    marginBottom: 20,
  },
  heroCardEmpty: {
    backgroundColor: '#c0392b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d4a338',
    padding: 20,
    marginBottom: 20,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroTextGroup: {
    flex: 1,
  },
  heroPetName: {
    color: '#d4a338',
    fontSize: 22,
    fontWeight: '800',
  },
  heroHint: {
    color: '#fdf5e6',
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'italic',
    marginTop: 4,
  },
  heroEmptyTitle: {
    color: '#fdf5e6',
    fontSize: 18,
    fontWeight: '800',
  },
  heroEmptyHint: {
    color: '#fdf5e6',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
    opacity: 0.8,
  },

  // ── New pet button ──────────────────────────────────────
  newPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fdf5e6',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2c3e6b',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 8,
  },
  newPetButtonText: {
    color: '#2c3e6b',
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Bottom section ──────────────────────────────────────
  bottomSection: {
    gap: 14,
  },
  languageCard: {
    backgroundColor: '#fdf5e6',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2c3e6b',
    padding: 14,
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
    color: '#c0392b',
    fontSize: 14,
    fontWeight: '500',
  },
});
