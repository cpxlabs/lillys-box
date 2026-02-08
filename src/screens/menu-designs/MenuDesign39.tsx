import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LanguageSelector } from '../../components/LanguageSelector';
import { useMenuLogic } from './useMenuLogic';
import { MenuModals } from './MenuModals';
import { ScreenNavigationProp } from '../../types/navigation';

/* ------------------------------------------------------------------ */
/*  Flower: center circle + 4 petal circles arranged top/right/bottom/left  */
/* ------------------------------------------------------------------ */
function Flower({ centerColor, petalColor }: { centerColor: string; petalColor: string }) {
  return (
    <View style={flowerStyles.container}>
      {/* Top petal */}
      <View style={[flowerStyles.petal, { backgroundColor: petalColor, top: 0, left: 9 }]} />
      {/* Right petal */}
      <View style={[flowerStyles.petal, { backgroundColor: petalColor, top: 9, right: 0 }]} />
      {/* Bottom petal */}
      <View style={[flowerStyles.petal, { backgroundColor: petalColor, bottom: 0, left: 9 }]} />
      {/* Left petal */}
      <View style={[flowerStyles.petal, { backgroundColor: petalColor, top: 9, left: 0 }]} />
      {/* Center */}
      <View style={[flowerStyles.center, { backgroundColor: centerColor }]} />
    </View>
  );
}

const flowerStyles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    position: 'relative',
  },
  petal: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
  },
  center: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    top: 8,
    left: 8,
  },
});

/* ------------------------------------------------------------------ */
/*  SteppingStones: row of 3 warm-gray rounded rectangles              */
/* ------------------------------------------------------------------ */
function SteppingStones() {
  return (
    <View style={stoneStyles.row}>
      <View style={stoneStyles.stone} />
      <View style={stoneStyles.stone} />
      <View style={stoneStyles.stone} />
    </View>
  );
}

const stoneStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stone: {
    width: 40,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#b0bec5',
  },
});

/* ================================================================== */
/*  MenuDesign39 — Garden Path                                         */
/* ================================================================== */
type Props = { navigation: ScreenNavigationProp<'Menu'> };

export const MenuDesign39: React.FC<Props> = ({ navigation }) => {
  const menu = useMenuLogic(navigation);
  const { pet, user, isGuest, t } = menu;
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={26} color="#66bb6a" />
        </TouchableOpacity>

        {/* 2. Flower + SteppingStones decoration row */}
        <View style={styles.decorRow}>
          <Flower centerColor="#fff176" petalColor="#f48fb1" />
          <SteppingStones />
          <Flower centerColor="#f48fb1" petalColor="#fff176" />
        </View>

        {/* 3. Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Pet Care</Text>
          <Text style={styles.subtitle}>Walk through the garden</Text>
        </View>

        {/* 4. Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>{userInitial}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName} numberOfLines={1}>
                {user?.name || t('guest')}
              </Text>
              {isGuest && (
                <View style={styles.guestBadge}>
                  <Text style={styles.guestBadgeText}>{t('guest')}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={menu.handleSignOut}
              activeOpacity={0.7}
            >
              <Feather name="log-out" size={20} color="#8d6e63" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. Hero Card */}
        {pet ? (
          <TouchableOpacity
            style={styles.heroCardWithPet}
            onPress={menu.handleContinue}
            activeOpacity={0.85}
          >
            <View style={styles.heroIconRow}>
              <Feather name="sun" size={28} color="#ffffff" />
            </View>
            <Text style={styles.heroPetName}>{pet.name}</Text>
            <Text style={styles.heroTagline}>Bloom together</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.heroCardNoPet}
            onPress={menu.handleNewPet}
            activeOpacity={0.85}
          >
            <View style={styles.heroIconRow}>
              <Feather name="plus-circle" size={28} color="#ffffff" />
            </View>
            <Text style={styles.heroNoPetText}>Plant a friendship</Text>
          </TouchableOpacity>
        )}

        {/* 6. SteppingStones + Flower decoration */}
        <View style={styles.decorRow}>
          <SteppingStones />
          <Flower centerColor="#fff176" petalColor="#f48fb1" />
          <SteppingStones />
        </View>

        {/* 7a. Language Card */}
        <View style={styles.languageCard}>
          <LanguageSelector />
        </View>

        {/* 7b. Delete Account */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={menu.handleDeletePet}
          activeOpacity={0.7}
        >
          <Feather name="trash-2" size={16} color="#8d6e63" />
          <Text style={styles.deleteText}>{t('deleteAccount') || 'Delete Account'}</Text>
        </TouchableOpacity>
      </ScrollView>

      <MenuModals {...menu} />
    </SafeAreaView>
  );
};

/* ================================================================== */
/*  Styles                                                             */
/* ================================================================== */
const styles = StyleSheet.create({
  /* Root */
  container: {
    flex: 1,
    backgroundColor: '#edf7ed',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },

  /* Back Button */
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#66bb6a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },

  /* Decoration Row */
  decorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 14,
  },

  /* Title */
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#388e3c',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8d6e63',
    marginTop: 4,
    letterSpacing: 0.3,
  },

  /* Profile Card */
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(102, 187, 106, 0.2)',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#66bb6a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f48fb1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8d6e63',
  },
  guestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#66bb6a',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 4,
  },
  guestBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  signOutButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(141, 110, 99, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Hero Card -- With Pet */
  heroCardWithPet: {
    backgroundColor: '#66bb6a',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#388e3c',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  heroIconRow: {
    marginBottom: 10,
  },
  heroPetName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  heroTagline: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },

  /* Hero Card -- No Pet */
  heroCardNoPet: {
    backgroundColor: '#f48fb1',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  heroNoPetText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 6,
  },

  /* Language Card */
  languageCard: {
    backgroundColor: '#fff176',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#f9a825',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },

  /* Delete Button */
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8d6e63',
  },
});
