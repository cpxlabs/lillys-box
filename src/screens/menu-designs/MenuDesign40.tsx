import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LanguageSelector } from '../../components/LanguageSelector';
import { useMenuLogic } from './useMenuLogic';
import { MenuModals } from './MenuModals';
import { ScreenNavigationProp } from '../../types/navigation';

/* ── Themed sub-components ─────────────────────────────── */

function TrainCar({ color }: { color: string }) {
  return (
    <View style={trainStyles.carWrapper}>
      {/* Chimney */}
      <View style={trainStyles.chimneyRow}>
        <View style={[trainStyles.chimney, { backgroundColor: color }]} />
      </View>
      {/* Body */}
      <View style={[trainStyles.body, { backgroundColor: color }]} />
      {/* Wheels */}
      <View style={trainStyles.wheelRow}>
        <View style={trainStyles.wheel} />
        <View style={trainStyles.wheel} />
      </View>
    </View>
  );
}

const TRACK_TIE_COUNT = 16;

function Railroad() {
  return (
    <View style={trainStyles.railroadContainer}>
      {/* Ties */}
      <View style={trainStyles.tiesRow}>
        {Array.from({ length: TRACK_TIE_COUNT }).map((_, i) => (
          <View key={i} style={trainStyles.tie} />
        ))}
      </View>
      {/* Rail */}
      <View style={trainStyles.rail} />
    </View>
  );
}

function SmokePuffs() {
  return (
    <View style={trainStyles.smokeContainer}>
      <View style={[trainStyles.smokePuff, { width: 16, height: 16, borderRadius: 8 }]} />
      <View
        style={[
          trainStyles.smokePuff,
          { width: 12, height: 12, borderRadius: 6, marginTop: -6, marginLeft: 14 },
        ]}
      />
      <View
        style={[
          trainStyles.smokePuff,
          { width: 8, height: 8, borderRadius: 4, marginTop: -4, marginLeft: 24 },
        ]}
      />
    </View>
  );
}

const trainStyles = StyleSheet.create({
  /* TrainCar */
  carWrapper: {
    alignItems: 'center',
  },
  chimneyRow: {
    alignItems: 'flex-start',
    width: 50,
    paddingLeft: 8,
  },
  chimney: {
    width: 10,
    height: 14,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  body: {
    width: 50,
    height: 30,
    borderRadius: 6,
  },
  wheelRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 50,
    marginTop: 2,
  },
  wheel: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#616161',
  },

  /* Railroad */
  railroadContainer: {
    width: '100%',
    marginVertical: 10,
    alignItems: 'center',
  },
  tiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
    marginBottom: -2,
  },
  tie: {
    width: 4,
    height: 10,
    backgroundColor: '#795548',
    borderRadius: 1,
  },
  rail: {
    height: 4,
    width: '100%',
    backgroundColor: '#795548',
    borderRadius: 2,
  },

  /* Smoke */
  smokeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'center',
    marginBottom: 4,
    paddingLeft: 10,
  },
  smokePuff: {
    backgroundColor: '#e0e0e0',
  },
});

/* ── Main component ────────────────────────────────────── */

type Props = { navigation: ScreenNavigationProp<'Menu'> };

export const MenuDesign40: React.FC<Props> = ({ navigation }) => {
  const menu = useMenuLogic(navigation);
  const { pet, user, isGuest, t } = menu;
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Back Button ──────────────────────────────── */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={menu.handleBack}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={26} color="#e53935" />
        </TouchableOpacity>

        {/* ── Smoke Puffs ──────────────────────────────── */}
        <SmokePuffs />

        {/* ── Train Row ────────────────────────────────── */}
        <View style={styles.trainRow}>
          <TrainCar color="#e53935" />
          <View style={styles.connector} />
          <TrainCar color="#1e88e5" />
          <View style={styles.connector} />
          <TrainCar color="#43a047" />
        </View>

        {/* ── Railroad ─────────────────────────────────── */}
        <Railroad />

        {/* ── Title ────────────────────────────────────── */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Pet Care</Text>
          <Text style={styles.subtitle}>All aboard!</Text>
        </View>

        {/* ── Profile Card ─────────────────────────────── */}
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
              <Feather name="log-out" size={20} color="#616161" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Hero Card ────────────────────────────────── */}
        {pet ? (
          <TouchableOpacity
            style={styles.heroCardWithPet}
            onPress={menu.handleContinue}
            activeOpacity={0.85}
          >
            <View style={styles.heroIconRow}>
              <Feather name="navigation" size={28} color="#ffffff" />
            </View>
            <Text style={styles.heroPetName}>{pet.name}</Text>
            <Text style={styles.heroTagline}>Next station</Text>
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
            <Text style={styles.heroNoPetText}>Board the train</Text>
          </TouchableOpacity>
        )}

        {/* ── Railroad ─────────────────────────────────── */}
        <Railroad />

        {/* ── Language Card ─────────────────────────────── */}
        <View style={styles.languageCard}>
          <LanguageSelector />
        </View>

        {/* ── Delete Account ───────────────────────────── */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={menu.handleDeletePet}
          activeOpacity={0.7}
        >
          <Feather name="trash-2" size={16} color="#e53935" />
          <Text style={styles.deleteText}>{t('deleteAccount') || 'Delete Account'}</Text>
        </TouchableOpacity>
      </ScrollView>

      <MenuModals {...menu} />
    </SafeAreaView>
  );
};

/* ── Styles ─────────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef9ef',
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
    borderWidth: 1.5,
    borderColor: '#e53935',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  /* Train Row */
  trainRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 2,
  },
  connector: {
    width: 8,
    height: 2,
    backgroundColor: '#999999',
    marginBottom: 14,
    marginHorizontal: 2,
  },

  /* Title */
  titleContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#e53935',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e88e5',
    marginTop: 4,
    letterSpacing: 0.3,
  },

  /* Profile Card */
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#1e88e5',
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#43a047',
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
    color: '#333333',
  },
  guestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1e88e5',
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
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Hero Card -- With Pet */
  heroCardWithPet: {
    backgroundColor: '#1e88e5',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
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
    color: 'rgba(255,255,255,0.8)',
  },

  /* Hero Card -- No Pet */
  heroCardNoPet: {
    backgroundColor: '#43a047',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  heroNoPetText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 6,
  },

  /* Language Card */
  languageCard: {
    backgroundColor: '#43a047',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
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
    color: '#e53935',
  },
});
