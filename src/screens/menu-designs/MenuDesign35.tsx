import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LanguageSelector } from '../../components/LanguageSelector';
import { useMenuLogic } from './useMenuLogic';
import { MenuModals } from './MenuModals';
import { ScreenNavigationProp } from '../../types/navigation';

function Balloon({ color }: { color: string }) {
  return (
    <View style={balloonStyles.wrapper}>
      <View style={[balloonStyles.envelope, { backgroundColor: color }]} />
      <View style={balloonStyles.line} />
      <View style={balloonStyles.basket} />
    </View>
  );
}

const balloonStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  envelope: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  line: {
    width: 2,
    height: 10,
    backgroundColor: '#999',
  },
  basket: {
    width: 16,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#8d6e63',
  },
});

function Cloud({ width }: { width: number }) {
  return (
    <View
      style={{
        width,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        opacity: 0.7,
      }}
    />
  );
}

type Props = { navigation: ScreenNavigationProp<'Menu'> };

export const MenuDesign35: React.FC<Props> = ({ navigation }) => {
  const menu = useMenuLogic(navigation);
  const { pet, user, isGuest, t } = menu;
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={26} color="#42a5f5" />
        </TouchableOpacity>

        {/* Top Cloud Row */}
        <View style={styles.cloudRowTop}>
          <Cloud width={80} />
          <Cloud width={60} />
          <Cloud width={100} />
        </View>

        {/* Balloon Row */}
        <View style={styles.balloonRow}>
          <View style={{ marginTop: -8 }}>
            <Balloon color="#ef5350" />
          </View>
          <View style={{ marginTop: 0 }}>
            <Balloon color="#ffca28" />
          </View>
          <View style={{ marginTop: -4 }}>
            <Balloon color="#42a5f5" />
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Pet Care</Text>
          <Text style={styles.subtitle}>Up, up and away!</Text>
        </View>

        {/* Profile Card */}
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
              <Feather name="log-out" size={20} color="#90a4ae" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Card */}
        {pet ? (
          <TouchableOpacity
            style={styles.heroCardWithPet}
            onPress={menu.handleContinue}
            activeOpacity={0.85}
          >
            <View style={styles.heroIconRow}>
              <Feather name="wind" size={28} color="#ffffff" />
            </View>
            <Text style={styles.heroPetName}>{pet.name}</Text>
            <Text style={styles.heroTagline}>Fly together</Text>
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
            <Text style={styles.heroNoPetText}>Launch your pet</Text>
          </TouchableOpacity>
        )}

        {/* Bottom Cloud Row */}
        <View style={styles.cloudRowBottom}>
          <Cloud width={70} />
          <Cloud width={90} />
        </View>

        {/* Language Card */}
        <View style={styles.languageCard}>
          <LanguageSelector />
        </View>

        {/* Delete Account */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={menu.handleDeletePet}
          activeOpacity={0.7}
        >
          <Feather name="trash-2" size={16} color="#ef9a9a" />
          <Text style={styles.deleteText}>{t('deleteAccount') || 'Delete Account'}</Text>
        </TouchableOpacity>
      </ScrollView>

      <MenuModals {...menu} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f2fd',
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
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  /* Cloud Rows */
  cloudRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
    paddingHorizontal: 10,
  },
  cloudRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 30,
  },

  /* Balloon Row */
  balloonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 24,
    marginBottom: 18,
  },

  /* Title */
  titleContainer: {
    alignItems: 'center',
    marginBottom: 22,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#42a5f5',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef5350',
    marginTop: 4,
    letterSpacing: 0.3,
  },

  /* Profile Card */
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
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
    backgroundColor: '#ffca28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333333',
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
    backgroundColor: 'rgba(66, 165, 245, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Hero Card -- With Pet */
  heroCardWithPet: {
    backgroundColor: '#42a5f5',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
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
    backgroundColor: '#66bb6a',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
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
    backgroundColor: '#ffca28',
    borderRadius: 20,
    padding: 20,
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
    color: '#ef9a9a',
  },
});
