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

export const MenuDesign1: React.FC<Props> = ({ navigation }) => {
  const menu = useMenuLogic(navigation);
  const { pet, user, isGuest, t } = menu;

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : '?';
  const petEmoji = pet ? (PET_EMOJIS[pet.type] ?? '\uD83D\uDC3E') : null;

  return (
    <View style={styles.container}>
      {/* Decorative gradient layers */}
      <View style={styles.gradientLayer1} />
      <View style={styles.gradientLayer2} />
      <View style={styles.gradientLayer3} />
      <View style={styles.gradientOrb1} />
      <View style={styles.gradientOrb2} />

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
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Profile card */}
          <View style={styles.glassCard}>
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
                    <Feather name="user" size={10} color="rgba(255,255,255,0.7)" />
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
                  <Feather name="log-out" size={16} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Title area */}
          <View style={styles.titleArea}>
            <Text style={styles.title}>Pet Care</Text>
            <Text style={styles.subtitle}>{t('menu.subtitle')}</Text>
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
                  <Text style={styles.heroEmoji}>{petEmoji}</Text>
                  <View style={styles.heroTextGroup}>
                    <Text style={styles.heroName}>{pet.name}</Text>
                    <Text style={styles.heroHint}>{t('menu.tapToContinue')}</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={24} color="rgba(255,255,255,0.6)" />
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
                  <Text style={styles.heroEmoji}>{'\u2728'}</Text>
                  <View style={styles.heroTextGroup}>
                    <Text style={styles.heroName}>{t('menu.createPet')}</Text>
                    <Text style={styles.heroHint}>{t('menu.createPetHint')}</Text>
                  </View>
                </View>
                <Feather name="plus-circle" size={24} color="rgba(255,255,255,0.6)" />
              </View>
            </TouchableOpacity>
          )}

          {/* Bottom row */}
          <View style={styles.bottomRow}>
            <View style={[styles.glassCard, styles.languageCard]}>
              <LanguageSelector />
            </View>
            {pet && (
              <TouchableOpacity
                style={[styles.glassCard, styles.deleteCard]}
                onPress={menu.handleDeletePet}
                accessibilityLabel="Delete pet"
                accessibilityRole="button"
              >
                <Feather name="trash-2" size={20} color="#fca5a5" />
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
    backgroundColor: '#4c1d95',
  },
  safeArea: {
    flex: 1,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // ── Decorative gradient layers ──────────────────────────
  gradientLayer1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: 'rgba(124, 58, 237, 0.5)',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
  },
  gradientLayer2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(167, 139, 250, 0.25)',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
  },
  gradientLayer3: {
    position: 'absolute',
    top: '20%',
    left: '-10%',
    width: '120%',
    height: '30%',
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 200,
    transform: [{ rotate: '-8deg' }],
  },
  gradientOrb1: {
    position: 'absolute',
    top: 60,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
  },
  gradientOrb2: {
    position: 'absolute',
    bottom: 100,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
  },

  // ── Back button ─────────────────────────────────────────
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  // ── Glass card base ─────────────────────────────────────
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    padding: 20,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },

  // ── Profile card ────────────────────────────────────────
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  profileEmail: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    marginTop: 2,
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
    gap: 4,
  },
  guestBadgeText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '600',
  },
  signOutButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  // ── Title area ──────────────────────────────────────────
  titleArea: {
    marginTop: 32,
    marginBottom: 28,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: 1,
    textShadowColor: 'rgba(167,139,250,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 8,
    letterSpacing: 0.3,
  },

  // ── Hero card ───────────────────────────────────────────
  heroCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    padding: 24,
    marginBottom: 24,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
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
    fontSize: 40,
    marginRight: 16,
  },
  heroTextGroup: {
    flex: 1,
  },
  heroName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  heroHint: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },

  // ── Bottom row ──────────────────────────────────────────
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  languageCard: {
    flex: 1,
    padding: 12,
  },
  deleteCard: {
    backgroundColor: 'rgba(239,68,68,0.2)',
    borderColor: 'rgba(239,68,68,0.3)',
    width: 56,
    height: 56,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
