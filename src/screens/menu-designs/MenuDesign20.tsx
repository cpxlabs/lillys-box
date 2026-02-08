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

export const MenuDesign20: React.FC<Props> = ({ navigation }) => {
  const menu = useMenuLogic(navigation);
  const { pet, user, isGuest, t } = menu;

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : '?';
  const petEmoji = pet?.type === 'cat' ? '\uD83D\uDC31' : pet?.type === 'dog' ? '\uD83D\uDC36' : '\uD83D\uDC3E';

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
            <Feather name="arrow-left" size={22} color="#dc2626" />
          </TouchableOpacity>

          {/* Circus banner */}
          <View style={styles.circusBanner}>
            <Text style={styles.bannerEmoji}>{'\uD83C\uDFAA'}</Text>
            <Text style={styles.bannerEmoji}>{'\uD83C\uDF88'}</Text>
            <Text style={styles.bannerEmoji}>{'\uD83E\uDD21'}</Text>
            <Text style={styles.bannerEmoji}>{'\uD83C\uDFA0'}</Text>
            <Text style={styles.bannerEmoji}>{'\uD83C\uDF88'}</Text>
            <Text style={styles.bannerEmoji}>{'\uD83C\uDFAA'}</Text>
          </View>

          {/* Title */}
          <View style={styles.titleArea}>
            <Text style={styles.title}>Pet Care</Text>
            <Text style={styles.subtitle}>
              Welcome to the show! {'\uD83C\uDFAA'}
            </Text>
          </View>

          {/* Ticket-style separator */}
          <View style={styles.ticketSeparator}>
            <View style={styles.ticketDashTop} />
            <Text style={styles.ticketText}>
              {'\uD83C\uDF9F\uFE0F'} ADMIT ONE {'\uD83C\uDF9F\uFE0F'}
            </Text>
            <View style={styles.ticketDashBottom} />
          </View>

          {/* Profile card */}
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{userInitial}</Text>
                </View>
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
                    <Feather name="user" size={10} color="#ffffff" />
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
                  <Feather name="log-out" size={15} color="#dc2626" />
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
                <View style={styles.heroLeft}>
                  <Text style={styles.heroTentEmoji}>{'\uD83C\uDFAA'}</Text>
                  <Text style={styles.heroEmoji}>{petEmoji}</Text>
                </View>
                <View style={styles.heroTextGroup}>
                  <Text style={styles.heroName}>{pet.name}</Text>
                  <Text style={styles.heroHint}>
                    Step right up! {'\uD83C\uDF89'}
                  </Text>
                </View>
                <Feather name="chevron-right" size={26} color="rgba(255,255,255,0.7)" />
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
                <View style={styles.heroLeft}>
                  <Text style={styles.heroEmoji}>{'\uD83C\uDFA0'}</Text>
                </View>
                <View style={styles.heroTextGroup}>
                  <Text style={styles.heroNameEmpty}>
                    Join the show! {'\uD83C\uDFA0'}
                  </Text>
                  <Text style={styles.heroHintEmpty}>{t('menu.createPetHint')}</Text>
                </View>
                <Feather name="star" size={26} color="rgba(255,255,255,0.7)" />
              </View>
            </TouchableOpacity>
          )}

          {/* Balloon decoration */}
          <View style={styles.balloonDecoration}>
            <View style={styles.balloonRow}>
              <Text style={styles.balloonEmoji}>{'\uD83C\uDF88'}</Text>
              <Text style={styles.balloonEmoji}>{'\uD83C\uDF88'}</Text>
              <Text style={styles.balloonEmoji}>{'\uD83C\uDF88'}</Text>
              <Text style={styles.balloonEmoji}>{'\uD83C\uDF88'}</Text>
              <Text style={styles.balloonEmoji}>{'\uD83C\uDF88'}</Text>
            </View>
            <View style={styles.dotRow}>
              <View style={[styles.colorDot, { backgroundColor: '#dc2626' }]} />
              <View style={[styles.colorDot, { backgroundColor: '#2563eb' }]} />
              <View style={[styles.colorDot, { backgroundColor: '#f59e0b' }]} />
              <View style={[styles.colorDot, { backgroundColor: '#16a34a' }]} />
              <View style={[styles.colorDot, { backgroundColor: '#f97316' }]} />
            </View>
          </View>

          {/* New pet button (secondary if pet exists) */}
          {pet && (
            <TouchableOpacity
              style={styles.newPetButton}
              onPress={menu.handleNewPet}
              activeOpacity={0.8}
              accessibilityLabel="Create a new pet"
              accessibilityRole="button"
            >
              <Feather name="plus" size={18} color="#dc2626" />
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
                <Feather name="trash-2" size={14} color="#b91c1c" />
                <Text style={styles.deleteText}>Delete {pet.name}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerEmoji}>{'\uD83C\uDF89'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83C\uDCCF'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83C\uDFAA'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83C\uDCCF'}</Text>
            <Text style={styles.footerEmoji}>{'\uD83C\uDF89'}</Text>
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
    backgroundColor: '#fdf6ec',
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
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderWidth: 2,
    borderColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },

  // ── Circus banner ─────────────────────────────────────────
  circusBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  bannerEmoji: {
    fontSize: 30,
  },

  // ── Title area ────────────────────────────────────────────
  titleArea: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#dc2626',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
    letterSpacing: 0.3,
  },

  // ── Ticket separator ──────────────────────────────────────
  ticketSeparator: {
    alignItems: 'center',
    marginBottom: 22,
    paddingVertical: 8,
  },
  ticketDashTop: {
    width: '80%',
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#f59e0b',
    marginBottom: 8,
  },
  ticketText: {
    color: '#f59e0b',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  ticketDashBottom: {
    width: '80%',
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#f59e0b',
    marginTop: 8,
  },

  // ── Profile card ──────────────────────────────────────────
  profileCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#dc2626',
    borderRightWidth: 3,
    borderRightColor: '#2563eb',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    padding: 3,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#f59e0b',
    backgroundColor: '#fdf6ec',
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#dc2626',
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
    color: '#dc2626',
    fontSize: 17,
    fontWeight: '700',
  },
  profileEmail: {
    color: '#92400e',
    fontSize: 13,
    marginTop: 2,
    opacity: 0.75,
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
    gap: 4,
  },
  guestBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.25)',
    gap: 6,
  },
  signOutText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Hero card ─────────────────────────────────────────────
  heroCard: {
    backgroundColor: '#dc2626',
    borderRadius: 18,
    padding: 24,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    borderRightWidth: 4,
    borderRightColor: '#f59e0b',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  heroCardEmpty: {
    backgroundColor: '#2563eb',
    borderRadius: 18,
    padding: 24,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    borderRightWidth: 4,
    borderRightColor: '#f59e0b',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  heroTentEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  heroEmoji: {
    fontSize: 44,
  },
  heroTextGroup: {
    flex: 1,
  },
  heroName: {
    color: '#f59e0b',
    fontSize: 22,
    fontWeight: '800',
  },
  heroNameEmpty: {
    color: '#f59e0b',
    fontSize: 20,
    fontWeight: '800',
  },
  heroHint: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  heroHintEmpty: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },

  // ── Balloon decoration ────────────────────────────────────
  balloonDecoration: {
    alignItems: 'center',
    marginBottom: 20,
  },
  balloonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  balloonEmoji: {
    fontSize: 22,
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },

  // ── New pet button ────────────────────────────────────────
  newPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#dc2626',
    gap: 8,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  newPetButtonText: {
    color: '#dc2626',
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Bottom section ────────────────────────────────────────
  bottomSection: {
    gap: 14,
  },
  languageCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 18,
    padding: 14,
    borderWidth: 2,
    borderColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(185, 28, 28, 0.08)',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(185, 28, 28, 0.2)',
    gap: 6,
  },
  deleteText: {
    color: '#b91c1c',
    fontSize: 14,
    fontWeight: '500',
  },

  // ── Footer ────────────────────────────────────────────────
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    gap: 12,
  },
  footerEmoji: {
    fontSize: 22,
    opacity: 0.7,
  },
});
