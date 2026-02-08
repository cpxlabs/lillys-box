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

const CRAYON_COLORS = {
  red: '#e74c3c',
  blue: '#3498db',
  green: '#2ecc71',
  orange: '#e67e22',
  purple: '#9b59b6',
  yellow: '#f1c40f',
};

const CRAYON_ORDER = [
  CRAYON_COLORS.red,
  CRAYON_COLORS.blue,
  CRAYON_COLORS.green,
  CRAYON_COLORS.orange,
  CRAYON_COLORS.purple,
  CRAYON_COLORS.yellow,
];

const CRAYON_ORDER_ALT = [
  CRAYON_COLORS.yellow,
  CRAYON_COLORS.purple,
  CRAYON_COLORS.orange,
  CRAYON_COLORS.green,
  CRAYON_COLORS.blue,
  CRAYON_COLORS.red,
];

const CrayonBar = ({ colors }: { colors: string[] }) => (
  <View style={styles.crayonBar}>
    {colors.map((color, index) => (
      <View
        key={index}
        style={[
          styles.crayonStick,
          {
            backgroundColor: color,
          },
        ]}
      />
    ))}
  </View>
);

export const MenuDesign28: React.FC<Props> = ({ navigation }) => {
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
            <Feather name="chevron-left" size={24} color={CRAYON_COLORS.purple} />
          </TouchableOpacity>

          {/* Crayon bar decoration */}
          <CrayonBar colors={CRAYON_ORDER} />

          {/* Title section */}
          <View style={styles.titleArea}>
            <Text style={styles.title}>Pet Care</Text>
            <View style={styles.titleUnderline} />
            <Text style={styles.subtitle}>Color your world</Text>
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
                  <Feather name="log-out" size={16} color={CRAYON_COLORS.red} />
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
                <View style={styles.heroIconCircle}>
                  <Feather name="smile" size={28} color="#ffffff" />
                </View>
                <View style={styles.heroTextGroup}>
                  <Text style={styles.heroName}>{pet.name}</Text>
                  <Text style={styles.heroHint}>Keep coloring</Text>
                </View>
                <Feather name="chevron-right" size={24} color="rgba(255,255,255,0.7)" />
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
                  <Feather name="edit" size={28} color="#ffffff" />
                </View>
                <View style={styles.heroTextGroup}>
                  <Text style={styles.heroNameEmpty}>Draw your pet</Text>
                  <Text style={styles.heroHintEmpty}>{t('menu.createPetHint')}</Text>
                </View>
                <Feather name="chevron-right" size={24} color="rgba(255,255,255,0.7)" />
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
              <Feather name="plus" size={18} color={CRAYON_COLORS.blue} />
              <Text style={styles.newPetButtonText}>{t('menu.createPet')}</Text>
            </TouchableOpacity>
          )}

          {/* Second crayon bar decoration (alternate arrangement) */}
          <CrayonBar colors={CRAYON_ORDER_ALT} />

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
                <Feather name="trash-2" size={15} color={CRAYON_COLORS.red} />
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
    backgroundColor: '#fff5ee',
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
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#9b59b6',
    shadowColor: '#9b59b6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  // ── Crayon bar decoration ─────────────────────────────────
  crayonBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 20,
  },
  crayonStick: {
    width: 12,
    height: 40,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },

  // ── Title area ──────────────────────────────────────────
  titleArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#3498db',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 1,
  },
  titleUnderline: {
    height: 4,
    width: 100,
    backgroundColor: '#e67e22',
    borderRadius: 2,
    marginTop: 6,
    marginBottom: 8,
  },
  subtitle: {
    color: '#2ecc71',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // ── Profile card ────────────────────────────────────────
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
    shadowColor: '#2c3e50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2ecc71',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    color: '#2c3e50',
    fontSize: 18,
    fontWeight: '700',
  },
  guestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1c40f',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
  },
  guestBadgeText: {
    color: '#2c3e50',
    fontSize: 11,
    fontWeight: '700',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fdf2f2',
    gap: 6,
  },
  signOutText: {
    color: '#e74c3c',
    fontSize: 12,
    fontWeight: '700',
  },

  // ── Hero card (pet exists) ──────────────────────────────
  heroCard: {
    backgroundColor: '#2ecc71',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderBottomWidth: 4,
    borderBottomColor: '#e67e22',
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  heroCardEmpty: {
    backgroundColor: '#3498db',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderBottomWidth: 4,
    borderBottomColor: '#e67e22',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  heroIconCircleEmpty: {
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
    fontWeight: '900',
  },
  heroHint: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  heroNameEmpty: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  heroHintEmpty: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '600',
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
    borderWidth: 3,
    borderColor: '#3498db',
    gap: 8,
  },
  newPetButtonText: {
    color: '#3498db',
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Bottom section ──────────────────────────────────────
  bottomSection: {
    gap: 14,
    marginTop: 4,
  },
  languageCard: {
    backgroundColor: '#fef9e7',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#9b59b6',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
  },
  deleteText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '600',
  },
});
