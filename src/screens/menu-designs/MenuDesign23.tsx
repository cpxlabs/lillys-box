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

export const MenuDesign23: React.FC<Props> = ({ navigation }) => {
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
            <Feather name="arrow-left" size={22} color="#6c5ce7" />
          </TouchableOpacity>

          {/* Decorative geometric shapes row */}
          <View style={styles.shapesRow}>
            <View style={[styles.shapeCircle, { width: 16, height: 16, borderRadius: 8, backgroundColor: '#ff7675' }]} />
            <View style={[styles.shapeSquare, { width: 14, height: 14, borderRadius: 3, backgroundColor: '#00cec9' }]} />
            <View style={[styles.shapeCircle, { width: 12, height: 12, borderRadius: 6, backgroundColor: '#fdcb6e' }]} />
            <View style={[styles.shapeSquare, { width: 16, height: 16, borderRadius: 3, backgroundColor: '#6c5ce7' }]} />
          </View>

          {/* Title */}
          <View style={styles.titleArea}>
            <Text style={styles.title}>Pet Care</Text>
            <Text style={styles.subtitle}>Fun shapes, happy pets</Text>
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
                <Text style={styles.profileEmail} numberOfLines={1}>
                  {user?.email ?? t('menu.noEmail')}
                </Text>
                {isGuest && (
                  <View style={styles.guestBadge}>
                    <Feather name="user" size={10} color="#2d3436" />
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
                  <Feather name="log-out" size={16} color="#ff7675" />
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
                <View style={styles.heroIconWrap}>
                  <Feather name="play-circle" size={28} color="#ffffff" />
                </View>
                <View style={styles.heroTextGroup}>
                  <Text style={styles.heroName}>{pet.name}</Text>
                  <Text style={styles.heroHint}>Let's go!</Text>
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
                <View style={styles.heroIconWrapEmpty}>
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

          {/* Second decorative geometric shapes row */}
          <View style={styles.shapesRowAlt}>
            <View style={[styles.shapeSquare, { width: 12, height: 12, borderRadius: 3, backgroundColor: '#6c5ce7' }]} />
            <View style={[styles.shapeCircle, { width: 18, height: 18, borderRadius: 9, backgroundColor: '#fdcb6e' }]} />
            <View style={[styles.shapeSquare, { width: 10, height: 10, borderRadius: 3, backgroundColor: '#ff7675' }]} />
            <View style={[styles.shapeCircle, { width: 14, height: 14, borderRadius: 7, backgroundColor: '#00cec9' }]} />
            <View style={[styles.shapeSquare, { width: 16, height: 16, borderRadius: 3, backgroundColor: '#fdcb6e' }]} />
          </View>

          {/* New pet button (if pet exists) */}
          {pet && (
            <TouchableOpacity
              style={styles.newPetButton}
              onPress={menu.handleNewPet}
              activeOpacity={0.8}
              accessibilityLabel="Create a new pet"
              accessibilityRole="button"
            >
              <Feather name="plus" size={18} color="#6c5ce7" />
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
                <Feather name="x-circle" size={14} color="#ff7675" />
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
    backgroundColor: '#f2f2f2',
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
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#6c5ce7',
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },

  // ── Geometric shapes rows ───────────────────────────────
  shapesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  shapesRowAlt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  shapeCircle: {
    // Sized and styled inline
  },
  shapeSquare: {
    // Sized and styled inline
  },

  // ── Title area ──────────────────────────────────────────
  titleArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#6c5ce7',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#00cec9',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
    letterSpacing: 0.3,
  },

  // ── Profile card ────────────────────────────────────────
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#ff7675',
    shadowColor: '#2d3436',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00cec9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    color: '#2d3436',
    fontSize: 17,
    fontWeight: '700',
  },
  profileEmail: {
    color: '#636e72',
    fontSize: 13,
    marginTop: 2,
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#fdcb6e',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
    gap: 4,
  },
  guestBadgeText: {
    color: '#2d3436',
    fontSize: 11,
    fontWeight: '600',
  },
  signOutButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 118, 117, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 118, 117, 0.3)',
  },

  // ── Hero card (with pet) ────────────────────────────────
  heroCard: {
    backgroundColor: '#00cec9',
    borderRadius: 18,
    padding: 22,
    marginBottom: 20,
    shadowColor: '#00cec9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  heroCardEmpty: {
    backgroundColor: '#6c5ce7',
    borderRadius: 18,
    padding: 22,
    marginBottom: 20,
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  heroIconWrapEmpty: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  heroHintEmpty: {
    color: 'rgba(255, 255, 255, 0.75)',
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
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#6c5ce7',
    gap: 8,
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  newPetButtonText: {
    color: '#6c5ce7',
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Bottom section ──────────────────────────────────────
  bottomSection: {
    gap: 14,
  },
  languageCard: {
    backgroundColor: '#fef3cd',
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 5,
    borderLeftColor: '#fdcb6e',
    shadowColor: '#2d3436',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
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
    color: '#ff7675',
    fontSize: 14,
    fontWeight: '500',
  },
});
