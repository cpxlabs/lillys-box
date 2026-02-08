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

export const MenuDesign25: React.FC<Props> = ({ navigation }) => {
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
            <Feather name="chevron-left" size={24} color="#5c4033" />
          </TouchableOpacity>

          {/* Paper strip title */}
          <View style={styles.titleCard}>
            <Text style={styles.titleText}>Pet Care</Text>
            <View style={styles.titleUnderline} />
          </View>

          {/* Profile card with paper shadow */}
          <View style={styles.profileCardWrapper}>
            <View style={styles.profileCardShadow} />
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
                    <Feather name="log-out" size={15} color="#8a7260" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Hero card with paper layering effect */}
          {pet ? (
            <TouchableOpacity
              style={styles.heroCardWrapper}
              onPress={menu.handleContinue}
              activeOpacity={0.85}
              accessibilityLabel={`Continue with ${pet.name}`}
              accessibilityRole="button"
            >
              <View style={styles.heroCardBackGreen} />
              <View style={styles.heroCard}>
                <View style={styles.heroContent}>
                  <View style={styles.heroIconContainer}>
                    <Feather name="heart" size={32} color="#e05252" />
                  </View>
                  <View style={styles.heroTextGroup}>
                    <Text style={styles.heroName}>{pet.name}</Text>
                    <Text style={styles.heroHint}>Keep going</Text>
                  </View>
                  <Feather name="chevron-right" size={22} color="#8a7260" />
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.heroCardWrapper}
              onPress={menu.handleNewPet}
              activeOpacity={0.85}
              accessibilityLabel="Create a new pet"
              accessibilityRole="button"
            >
              <View style={styles.heroCardBackBlue} />
              <View style={styles.heroCard}>
                <View style={styles.heroContent}>
                  <View style={styles.heroIconContainerEmpty}>
                    <Feather name="scissors" size={30} color="#5b9bd5" />
                  </View>
                  <View style={styles.heroTextGroup}>
                    <Text style={styles.heroNameEmpty}>Cut out your new pet</Text>
                    <Text style={styles.heroHintEmpty}>{t('menu.createPetHint')}</Text>
                  </View>
                  <Feather name="chevron-right" size={22} color="#8a7260" />
                </View>
              </View>
            </TouchableOpacity>
          )}

          {/* New pet button (when pet exists) */}
          {pet && (
            <TouchableOpacity
              style={styles.newPetButton}
              onPress={menu.handleNewPet}
              activeOpacity={0.85}
              accessibilityLabel="Create a new pet"
              accessibilityRole="button"
            >
              <Feather name="plus" size={18} color="#5c4033" />
              <Text style={styles.newPetButtonText}>{t('menu.createPet')}</Text>
            </TouchableOpacity>
          )}

          {/* Paper confetti decoration */}
          <View style={styles.confettiRow}>
            <View style={[styles.confettiPiece, { backgroundColor: '#e05252' }]} />
            <View style={[styles.confettiPiece, { backgroundColor: '#5b9bd5' }]} />
            <View style={[styles.confettiPiece, { backgroundColor: '#6ab04c' }]} />
            <View style={[styles.confettiPiece, { backgroundColor: '#f9ca24' }]} />
            <View style={[styles.confettiPiece, { backgroundColor: '#e05252' }]} />
          </View>

          {/* Bottom section */}
          <View style={styles.bottomSection}>
            {/* Language selector in yellow paper card */}
            <View style={styles.languageCardWrapper}>
              <View style={styles.languageCardShadow} />
              <View style={styles.languageCard}>
                <LanguageSelector />
              </View>
            </View>

            {/* Delete pet */}
            {pet && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={menu.handleDeletePet}
                accessibilityLabel="Delete pet"
                accessibilityRole="button"
              >
                <Feather name="trash-2" size={14} color="#e05252" />
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
    backgroundColor: '#e8d5b7',
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
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d4c1a8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#5c4033',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 2,
  },

  // ── Title card (paper strip) ──────────────────────────
  titleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d4c1a8',
    shadowColor: '#5c4033',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  titleText: {
    color: '#5c4033',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 1,
  },
  titleUnderline: {
    width: 80,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e05252',
    marginTop: 10,
  },

  // ── Profile card ──────────────────────────────────────
  profileCardWrapper: {
    marginBottom: 24,
    position: 'relative',
  },
  profileCardShadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: '#d4c1a8',
    borderRadius: 8,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 18,
    borderWidth: 1,
    borderColor: '#d4c1a8',
    shadowColor: '#5c4033',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
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
    backgroundColor: '#5b9bd5',
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
    color: '#5c4033',
    fontSize: 18,
    fontWeight: '700',
  },
  guestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f9ca24',
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
  },
  guestBadgeText: {
    color: '#5c4033',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  signOutButton: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d4c1a8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5c4033',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 0,
    elevation: 2,
  },

  // ── Hero card (paper layering) ────────────────────────
  heroCardWrapper: {
    marginBottom: 24,
    position: 'relative',
  },
  heroCardBackGreen: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: -6,
    bottom: -6,
    backgroundColor: '#6ab04c',
    borderRadius: 8,
  },
  heroCardBackBlue: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: -6,
    bottom: -6,
    backgroundColor: '#5b9bd5',
    borderRadius: 8,
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 22,
    borderWidth: 1,
    borderColor: '#d4c1a8',
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIconContainer: {
    width: 58,
    height: 58,
    borderRadius: 8,
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#e05252',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  heroIconContainerEmpty: {
    width: 58,
    height: 58,
    borderRadius: 8,
    backgroundColor: '#f0f6ff',
    borderWidth: 1,
    borderColor: '#5b9bd5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  heroTextGroup: {
    flex: 1,
  },
  heroName: {
    color: '#5c4033',
    fontSize: 22,
    fontWeight: '800',
  },
  heroHint: {
    color: '#8a7260',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  heroNameEmpty: {
    color: '#5c4033',
    fontSize: 18,
    fontWeight: '700',
  },
  heroHintEmpty: {
    color: '#8a7260',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },

  // ── New pet button ────────────────────────────────────
  newPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#d4c1a8',
    gap: 8,
    shadowColor: '#5c4033',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  newPetButtonText: {
    color: '#5c4033',
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Paper confetti ────────────────────────────────────
  confettiRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    marginBottom: 28,
  },
  confettiPiece: {
    width: 8,
    height: 8,
    borderRadius: 1,
  },

  // ── Bottom section ────────────────────────────────────
  bottomSection: {
    gap: 16,
  },
  languageCardWrapper: {
    position: 'relative',
  },
  languageCardShadow: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: -3,
    bottom: -3,
    backgroundColor: '#f9ca24',
    borderRadius: 8,
  },
  languageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#d4c1a8',
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
    color: '#e05252',
    fontSize: 14,
    fontWeight: '500',
  },
});
