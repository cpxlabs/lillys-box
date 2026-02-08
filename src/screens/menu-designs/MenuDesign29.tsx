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

/** A single paw print made from View circles: 1 pad + 3 toes */
const PawPrint: React.FC<{ size?: number; color?: string; opacity?: number; rotation?: number }> = ({
  size = 1,
  color = '#8B6F47',
  opacity = 0.2,
  rotation = 0,
}) => {
  const padSize = 18 * size;
  const toeSize = 8 * size;
  const toeGap = 2 * size;
  const toeOffset = 2 * size;

  return (
    <View style={{ opacity, transform: [{ rotate: `${rotation}deg` }], alignItems: 'center' }}>
      {/* Toes row */}
      <View style={{ flexDirection: 'row', marginBottom: toeOffset, gap: toeGap }}>
        <View
          style={{
            width: toeSize,
            height: toeSize,
            borderRadius: toeSize / 2,
            backgroundColor: color,
          }}
        />
        <View
          style={{
            width: toeSize,
            height: toeSize,
            borderRadius: toeSize / 2,
            backgroundColor: color,
            marginTop: -(toeSize * 0.3),
          }}
        />
        <View
          style={{
            width: toeSize,
            height: toeSize,
            borderRadius: toeSize / 2,
            backgroundColor: color,
          }}
        />
      </View>
      {/* Main pad */}
      <View
        style={{
          width: padSize,
          height: padSize,
          borderRadius: padSize / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
};

export const MenuDesign29: React.FC<Props> = ({ navigation }) => {
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
            <Feather name="arrow-left" size={22} color="#8B6F47" />
          </TouchableOpacity>

          {/* Paw print decoration row */}
          <View style={styles.pawRow}>
            <PawPrint size={0.9} rotation={-15} />
            <PawPrint size={1.1} rotation={5} />
            <PawPrint size={0.8} rotation={20} />
          </View>

          {/* Title area */}
          <View style={styles.titleArea}>
            <Text style={styles.title}>Pet Care</Text>
            <Text style={styles.subtitle}>Love your furry friend</Text>
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
                  <Feather name="log-out" size={15} color="#8B6F47" />
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
              activeOpacity={0.85}
              accessibilityLabel={`Continue with ${pet.name}`}
              accessibilityRole="button"
            >
              <View style={styles.heroContent}>
                <View style={styles.heroIconWrap}>
                  <Feather name="heart" size={28} color="#e8a87c" />
                </View>
                <View style={styles.heroTextGroup}>
                  <Text style={styles.heroName}>{pet.name}</Text>
                  <Text style={styles.heroHint}>Your best friend awaits</Text>
                </View>
                <Feather name="chevron-right" size={24} color="rgba(253,248,240,0.6)" />
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
                  <Feather name="plus-circle" size={28} color="#fdf8f0" />
                </View>
                <View style={styles.heroTextGroup}>
                  <Text style={styles.heroNameEmpty}>Adopt your pet</Text>
                  <Text style={styles.heroHintEmpty}>{t('menu.createPetHint')}</Text>
                </View>
                <Feather name="chevron-right" size={24} color="rgba(253,248,240,0.6)" />
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
              <Feather name="plus" size={18} color="#8B6F47" />
              <Text style={styles.newPetButtonText}>{t('menu.createPet')}</Text>
            </TouchableOpacity>
          )}

          {/* Small paw print decoration */}
          <View style={styles.pawRowSmall}>
            <PawPrint size={0.7} rotation={-10} color="#e8a87c" opacity={0.25} />
            <PawPrint size={0.6} rotation={12} color="#b5a899" opacity={0.2} />
            <PawPrint size={0.75} rotation={-5} color="#6fadd5" opacity={0.2} />
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
                <Feather name="trash-2" size={14} color="#a0695c" />
                <Text style={styles.deleteText}>Delete {pet.name}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer paw trail */}
          <View style={styles.footer}>
            <PawPrint size={0.5} rotation={-20} color="#8B6F47" opacity={0.1} />
            <PawPrint size={0.45} rotation={10} color="#e8a87c" opacity={0.1} />
            <PawPrint size={0.4} rotation={-8} color="#b5a899" opacity={0.1} />
            <PawPrint size={0.35} rotation={15} color="#6fadd5" opacity={0.1} />
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
    backgroundColor: '#faf0e4',
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
    backgroundColor: '#fdf8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(139,111,71,0.2)',
    shadowColor: '#8B6F47',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },

  // ── Paw print decoration rows ─────────────────────────
  pawRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    gap: 20,
  },
  pawRowSmall: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 24,
  },

  // ── Title area ──────────────────────────────────────────
  titleArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#8B6F47',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#e8a87c',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
    letterSpacing: 0.3,
  },

  // ── Profile card ────────────────────────────────────────
  profileCard: {
    backgroundColor: '#fdf8f0',
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(139,111,71,0.2)',
    shadowColor: '#8B6F47',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
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
    backgroundColor: '#8B6F47',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fdf8f0',
    fontSize: 22,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    color: '#3a2e20',
    fontSize: 17,
    fontWeight: '700',
  },
  guestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#6fadd5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
  },
  guestBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(139,111,71,0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(139,111,71,0.2)',
    gap: 6,
  },
  signOutText: {
    color: '#8B6F47',
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Hero card (pet exists) ────────────────────────────
  heroCard: {
    backgroundColor: '#8B6F47',
    borderRadius: 22,
    padding: 22,
    marginBottom: 16,
    shadowColor: '#8B6F47',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  heroCardEmpty: {
    backgroundColor: '#6fadd5',
    borderRadius: 22,
    padding: 22,
    marginBottom: 16,
    shadowColor: '#6fadd5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(253,248,240,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  heroIconWrapEmpty: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(253,248,240,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  heroTextGroup: {
    flex: 1,
  },
  heroName: {
    color: '#fdf8f0',
    fontSize: 22,
    fontWeight: '800',
  },
  heroHint: {
    color: 'rgba(253,248,240,0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  heroNameEmpty: {
    color: '#fdf8f0',
    fontSize: 20,
    fontWeight: '800',
  },
  heroHintEmpty: {
    color: 'rgba(253,248,240,0.75)',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },

  // ── New pet button ──────────────────────────────────────
  newPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fdf8f0',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(139,111,71,0.2)',
    gap: 8,
    shadowColor: '#8B6F47',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  newPetButtonText: {
    color: '#8B6F47',
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Bottom section ──────────────────────────────────────
  bottomSection: {
    gap: 14,
  },
  languageCard: {
    backgroundColor: '#fce8da',
    borderRadius: 20,
    padding: 14,
    shadowColor: '#8B6F47',
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
    color: '#a0695c',
    fontSize: 14,
    fontWeight: '500',
  },

  // ── Footer ──────────────────────────────────────────────
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    gap: 18,
  },
});
