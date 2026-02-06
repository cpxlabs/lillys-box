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

export const MenuDesign9: React.FC<Props> = ({ navigation }) => {
  const menu = useMenuLogic(navigation);
  const { pet, user, isGuest, t } = menu;

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : '?';
  const petEmoji = pet ? (PET_EMOJIS[pet.type] ?? '\uD83D\uDC3E') : null;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Back Button ─────────────────────────────────── */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={menu.handleBack}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>{'< BACK'}</Text>
          </TouchableOpacity>

          {/* ── Profile Card ────────────────────────────────── */}
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatarSquare}>
                <Text style={styles.avatarText}>{userInitial}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {user?.email ? user.email.split('@')[0].toUpperCase() : t('menu.guest').toUpperCase()}
                </Text>
                <Text style={styles.profileEmail} numberOfLines={1}>
                  {user?.email ?? t('menu.noEmail')}
                </Text>
                {isGuest && (
                  <View style={styles.guestBadge}>
                    <Text style={styles.guestBadgeText}>GUEST</Text>
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
                  <Text style={styles.signOutText}>LOG OUT</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ── Title ───────────────────────────────────────── */}
          <View style={styles.titleArea}>
            <Text style={styles.title}>PET CARE</Text>
            <Text style={styles.subtitle}>{t('menu.subtitle').toUpperCase()}</Text>
          </View>

          {/* ── Hero Card ───────────────────────────────────── */}
          {pet ? (
            <TouchableOpacity
              style={[styles.heroCard, styles.heroCardContinue]}
              onPress={menu.handleContinue}
              activeOpacity={0.8}
              accessibilityLabel={`Continue with ${pet.name}`}
              accessibilityRole="button"
            >
              <Text style={styles.heroEmoji}>{petEmoji}</Text>
              <Text style={styles.heroName}>{pet.name.toUpperCase()}</Text>
              <Text style={styles.heroAction}>{'>> CONTINUE >>'}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.heroCard, styles.heroCardNew]}
              onPress={menu.handleNewPet}
              activeOpacity={0.8}
              accessibilityLabel="Create a new pet"
              accessibilityRole="button"
            >
              <Text style={styles.heroEmoji}>{'\u2728'}</Text>
              <Text style={styles.heroName}>{t('menu.createPet').toUpperCase()}</Text>
              <Text style={styles.heroActionNew}>{'>> NEW GAME >>'}</Text>
            </TouchableOpacity>
          )}

          {/* ── New Pet Button (when pet exists) ────────────── */}
          {pet && (
            <TouchableOpacity
              style={[styles.heroCard, styles.heroCardNew, { marginTop: 0 }]}
              onPress={menu.handleNewPet}
              activeOpacity={0.8}
              accessibilityLabel="Start new game"
              accessibilityRole="button"
            >
              <Text style={styles.heroEmoji}>{'\u2728'}</Text>
              <Text style={styles.heroName}>{t('menu.createPet').toUpperCase()}</Text>
              <Text style={styles.heroActionNew}>{'>> NEW GAME >>'}</Text>
            </TouchableOpacity>
          )}

          {/* ── Bottom Row ──────────────────────────────────── */}
          <View style={styles.bottomRow}>
            <View style={styles.languageCard}>
              <LanguageSelector />
            </View>
            {pet && (
              <TouchableOpacity
                style={styles.deleteCard}
                onPress={menu.handleDeletePet}
                accessibilityLabel="Delete pet"
                accessibilityRole="button"
              >
                <Feather name="trash-2" size={18} color="#f44336" />
                <Text style={styles.deleteText}>DELETE</Text>
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
    backgroundColor: '#2c2137',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // ── Back Button ─────────────────────────────────────────
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  backButtonText: {
    color: '#ffeb3b',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // ── Profile Card ────────────────────────────────────────
  profileCard: {
    backgroundColor: '#3d2952',
    borderWidth: 3,
    borderColor: '#ffeb3b',
    borderRadius: 4,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 6,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSquare: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: '#2c2137',
    borderWidth: 3,
    borderColor: '#ffeb3b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffeb3b',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    color: '#ffeb3b',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  profileEmail: {
    color: '#aaaaaa',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 3,
    textTransform: 'uppercase',
  },
  guestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#4caf50',
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
  },
  guestBadgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  signOutButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#f44336',
    borderRadius: 2,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  signOutText: {
    color: '#f44336',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // ── Title Area ──────────────────────────────────────────
  titleArea: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    color: '#ffeb3b',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 4,
    textTransform: 'uppercase',
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  subtitle: {
    color: '#4caf50',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 3,
    marginTop: 8,
    textTransform: 'uppercase',
  },

  // ── Hero Card ───────────────────────────────────────────
  heroCard: {
    backgroundColor: '#3d2952',
    borderWidth: 3,
    borderRadius: 4,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 6,
  },
  heroCardContinue: {
    borderColor: '#4caf50',
  },
  heroCardNew: {
    borderColor: '#2196f3',
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  heroName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  heroAction: {
    color: '#4caf50',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  heroActionNew: {
    color: '#2196f3',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },

  // ── Bottom Row ──────────────────────────────────────────
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    marginTop: 8,
  },
  languageCard: {
    flex: 1,
    backgroundColor: '#3d2952',
    borderWidth: 3,
    borderColor: '#2196f3',
    borderRadius: 4,
    padding: 8,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 6,
  },
  deleteCard: {
    backgroundColor: '#3d2952',
    borderWidth: 3,
    borderColor: '#f44336',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 6,
  },
  deleteText: {
    color: '#f44336',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 4,
    textTransform: 'uppercase',
  },
});
