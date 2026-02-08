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

export const MenuDesign27: React.FC<Props> = ({ navigation }) => {
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
          {/* Back button in a bubble circle */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={menu.handleBack}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Feather name="arrow-left" size={22} color="#a29bfe" />
          </TouchableOpacity>

          {/* Bubble decoration row */}
          <View style={styles.bubbleDecoRow}>
            <View style={[styles.bubbleDeco, styles.bubbleDeco1]} />
            <View style={[styles.bubbleDeco, styles.bubbleDeco2]} />
            <View style={[styles.bubbleDeco, styles.bubbleDeco3]} />
            <View style={[styles.bubbleDeco, styles.bubbleDeco4]} />
            <View style={[styles.bubbleDeco, styles.bubbleDeco5]} />
          </View>

          {/* Title section */}
          <View style={styles.titleArea}>
            <Text style={styles.title}>Pet Care</Text>
            <Text style={styles.subtitle}>Pop into fun!</Text>
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
                  <View style={styles.signOutIconBubble}>
                    <Feather name="log-out" size={16} color="#fff" />
                  </View>
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
                <View style={styles.heroIconBubble}>
                  <Feather name="play" size={28} color="#fff" />
                </View>
                <View style={styles.heroTextGroup}>
                  <Text style={styles.heroName}>{pet.name}</Text>
                  <Text style={styles.heroHint}>Pop in!</Text>
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
                <View style={styles.heroIconBubbleEmpty}>
                  <Feather name="plus" size={28} color="#333" />
                </View>
                <View style={styles.heroTextGroup}>
                  <Text style={styles.heroNameEmpty}>Create your pet</Text>
                  <Text style={styles.heroHintEmpty}>{t('menu.createPetHint')}</Text>
                </View>
                <Feather name="chevron-right" size={24} color="rgba(51,51,51,0.5)" />
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
              <View style={styles.newPetIconBubble}>
                <Feather name="plus" size={18} color="#fff" />
              </View>
              <Text style={styles.newPetButtonText}>{t('menu.createPet')}</Text>
            </TouchableOpacity>
          )}

          {/* Second bubble decoration row */}
          <View style={styles.bubbleDecoRow2}>
            <View style={[styles.bubbleDeco, styles.bubbleDeco6]} />
            <View style={[styles.bubbleDeco, styles.bubbleDeco7]} />
            <View style={[styles.bubbleDeco, styles.bubbleDeco8]} />
            <View style={[styles.bubbleDeco, styles.bubbleDeco9]} />
            <View style={[styles.bubbleDeco, styles.bubbleDeco10]} />
            <View style={[styles.bubbleDeco, styles.bubbleDeco11]} />
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
                <Feather name="x-circle" size={16} color="#fd79a8" />
                <Text style={styles.deleteText}>Delete {pet.name}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer bubble decoration */}
          <View style={styles.footer}>
            <View style={styles.footerBubbleRow}>
              <View style={[styles.footerBubble, { width: 8, height: 8, backgroundColor: '#74b9ff' }]} />
              <View style={[styles.footerBubble, { width: 12, height: 12, backgroundColor: '#fd79a8' }]} />
              <View style={[styles.footerBubble, { width: 6, height: 6, backgroundColor: '#55efc4' }]} />
              <View style={[styles.footerBubble, { width: 10, height: 10, backgroundColor: '#a29bfe' }]} />
              <View style={[styles.footerBubble, { width: 8, height: 8, backgroundColor: '#ffeaa7' }]} />
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
    backgroundColor: '#f0faf5',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(162,155,254,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  // ── Bubble decoration row 1 ─────────────────────────────
  bubbleDecoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    marginBottom: 12,
  },
  bubbleDeco: {
    borderRadius: 999,
  },
  bubbleDeco1: {
    width: 20,
    height: 20,
    backgroundColor: '#74b9ff',
    marginTop: -4,
    opacity: 0.7,
  },
  bubbleDeco2: {
    width: 14,
    height: 14,
    backgroundColor: '#fd79a8',
    marginTop: 2,
    opacity: 0.6,
  },
  bubbleDeco3: {
    width: 24,
    height: 24,
    backgroundColor: '#55efc4',
    marginTop: -6,
    opacity: 0.65,
  },
  bubbleDeco4: {
    width: 12,
    height: 12,
    backgroundColor: '#a29bfe',
    marginTop: 0,
    opacity: 0.7,
  },
  bubbleDeco5: {
    width: 18,
    height: 18,
    backgroundColor: '#ffeaa7',
    marginTop: -2,
    opacity: 0.75,
  },

  // ── Title area ──────────────────────────────────────────
  titleArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#a29bfe',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#74b9ff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
    letterSpacing: 0.3,
  },

  // ── Profile card ────────────────────────────────────────
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 22,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#74b9ff',
    shadowColor: '#74b9ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#55efc4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    color: '#333',
    fontSize: 18,
    fontWeight: '700',
  },
  guestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffeaa7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 6,
  },
  guestBadgeText: {
    color: '#333',
    fontSize: 11,
    fontWeight: '700',
  },
  signOutButton: {
    padding: 4,
  },
  signOutIconBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fd79a8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Hero card (pet exists) ──────────────────────────────
  heroCard: {
    backgroundColor: '#74b9ff',
    borderRadius: 30,
    padding: 22,
    marginBottom: 16,
    shadowColor: '#74b9ff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  heroCardEmpty: {
    backgroundColor: '#55efc4',
    borderRadius: 30,
    padding: 22,
    marginBottom: 16,
    shadowColor: '#55efc4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIconBubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  heroIconBubbleEmpty: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  heroTextGroup: {
    flex: 1,
  },
  heroName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  heroHint: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  heroNameEmpty: {
    color: '#333',
    fontSize: 20,
    fontWeight: '800',
  },
  heroHintEmpty: {
    color: '#333',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
    opacity: 0.6,
  },

  // ── New pet button ──────────────────────────────────────
  newPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 22,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#55efc4',
    gap: 10,
    shadowColor: '#55efc4',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  newPetIconBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#55efc4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newPetButtonText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Bubble decoration row 2 ─────────────────────────────
  bubbleDecoRow2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  bubbleDeco6: {
    width: 16,
    height: 16,
    backgroundColor: '#fd79a8',
    marginTop: 2,
    opacity: 0.55,
  },
  bubbleDeco7: {
    width: 10,
    height: 10,
    backgroundColor: '#a29bfe',
    marginTop: -4,
    opacity: 0.6,
  },
  bubbleDeco8: {
    width: 22,
    height: 22,
    backgroundColor: '#ffeaa7',
    marginTop: 4,
    opacity: 0.7,
  },
  bubbleDeco9: {
    width: 14,
    height: 14,
    backgroundColor: '#74b9ff',
    marginTop: -2,
    opacity: 0.6,
  },
  bubbleDeco10: {
    width: 8,
    height: 8,
    backgroundColor: '#55efc4',
    marginTop: 0,
    opacity: 0.65,
  },
  bubbleDeco11: {
    width: 18,
    height: 18,
    backgroundColor: '#fd79a8',
    marginTop: -3,
    opacity: 0.5,
  },

  // ── Bottom section ──────────────────────────────────────
  bottomSection: {
    gap: 14,
  },
  languageCard: {
    backgroundColor: '#fff8e7',
    borderRadius: 24,
    padding: 16,
    borderWidth: 2,
    borderColor: '#ffeaa7',
    shadowColor: '#ffeaa7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
  },
  deleteText: {
    color: '#fd79a8',
    fontSize: 14,
    fontWeight: '600',
  },

  // ── Footer ──────────────────────────────────────────────
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerBubbleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  footerBubble: {
    borderRadius: 999,
    opacity: 0.5,
  },
});
