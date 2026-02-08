import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LanguageSelector } from '../../components/LanguageSelector';
import { useMenuLogic } from './useMenuLogic';
import { MenuModals } from './MenuModals';
import { ScreenNavigationProp } from '../../types/navigation';

const STAR_CONFIGS = [
  { size: 8, color: '#f0c75e', opacity: 0.8, marginHorizontal: 6 },
  { size: 10, color: '#ffffff', opacity: 0.4, marginHorizontal: 10 },
  { size: 12, color: '#f0c75e', opacity: 0.6, marginHorizontal: 8 },
  { size: 8, color: '#ffffff', opacity: 0.3, marginHorizontal: 12 },
  { size: 10, color: '#f0c75e', opacity: 0.7, marginHorizontal: 6 },
];

function StarRow() {
  return (
    <View style={styles.starRow}>
      {STAR_CONFIGS.map((star, index) => (
        <View
          key={index}
          style={[
            styles.star,
            {
              width: star.size,
              height: star.size,
              backgroundColor: star.color,
              opacity: star.opacity,
              marginHorizontal: star.marginHorizontal,
            },
          ]}
        />
      ))}
    </View>
  );
}

function CrescentMoon() {
  return (
    <View style={styles.crescentContainer}>
      <View style={styles.moonOuter}>
        <View style={styles.moonInner} />
      </View>
    </View>
  );
}

type Props = { navigation: ScreenNavigationProp<'Menu'> };

export const MenuDesign31: React.FC<Props> = ({ navigation }) => {
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
          <Feather name="arrow-left" size={26} color="#f0c75e" />
        </TouchableOpacity>

        {/* Star Decoration Row */}
        <StarRow />

        {/* Crescent Moon */}
        <CrescentMoon />

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Pet Care</Text>
          <Text style={styles.subtitle}>Under the stars</Text>
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
              <Feather name="log-out" size={20} color="#d4dce6" />
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
              <Feather name="star" size={28} color="#1b2838" />
            </View>
            <Text style={styles.heroPetName}>{pet.name}</Text>
            <Text style={styles.heroTagline}>Goodnight adventure</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.heroCardNoPet}
            onPress={menu.handleNewPet}
            activeOpacity={0.85}
          >
            <View style={styles.heroIconRow}>
              <Feather name="plus-circle" size={28} color="#1b2838" />
            </View>
            <Text style={styles.heroNoPetText}>Create your pet</Text>
          </TouchableOpacity>
        )}

        {/* Star Decoration Row */}
        <StarRow />

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
          <Feather name="trash-2" size={16} color="#e88a8a" />
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
    backgroundColor: '#1b2838',
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
    backgroundColor: '#253649',
    borderWidth: 1,
    borderColor: 'rgba(240, 199, 94, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },

  /* Star Decoration */
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  star: {
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },

  /* Crescent Moon */
  crescentContainer: {
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  moonOuter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#f0c75e',
    backgroundColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
  },
  moonInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1b2838',
    position: 'absolute',
    top: -4,
    left: 10,
  },

  /* Title */
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#f0c75e',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d4dce6',
    marginTop: 4,
    letterSpacing: 0.3,
  },

  /* Profile Card */
  profileCard: {
    backgroundColor: '#253649',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(240, 199, 94, 0.4)',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
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
    backgroundColor: '#f0c75e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1b2838',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  guestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#d4dce6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 4,
  },
  guestBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1b2838',
  },
  signOutButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(212, 220, 230, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Hero Card -- With Pet */
  heroCardWithPet: {
    backgroundColor: '#f0c75e',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  heroIconRow: {
    marginBottom: 10,
  },
  heroPetName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1b2838',
    marginBottom: 4,
  },
  heroTagline: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1b2838',
    opacity: 0.8,
  },

  /* Hero Card -- No Pet */
  heroCardNoPet: {
    backgroundColor: '#d4dce6',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  heroNoPetText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1b2838',
    marginTop: 6,
  },

  /* Language Card */
  languageCard: {
    backgroundColor: '#253649',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(240, 199, 94, 0.4)',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
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
    color: '#e88a8a',
  },
});
