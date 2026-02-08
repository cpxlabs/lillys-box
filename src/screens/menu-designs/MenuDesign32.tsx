import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LanguageSelector } from '../../components/LanguageSelector';
import { useMenuLogic } from './useMenuLogic';
import { MenuModals } from './MenuModals';
import { ScreenNavigationProp } from '../../types/navigation';

const DOT_COLORS = {
  pink: '#ff9a9e',
  blue: '#a1c4fd',
  green: '#96e6a1',
  yellow: '#ffeaa7',
  purple: '#c9b1ff',
};

const DOT_ROW_TOP: { size: number; color: string }[] = [
  { size: 14, color: DOT_COLORS.pink },
  { size: 10, color: DOT_COLORS.blue },
  { size: 18, color: DOT_COLORS.green },
  { size: 12, color: DOT_COLORS.yellow },
  { size: 16, color: DOT_COLORS.purple },
  { size: 10, color: DOT_COLORS.pink },
  { size: 14, color: DOT_COLORS.blue },
];

const DOT_ROW_BOTTOM: { size: number; color: string }[] = [
  { size: 12, color: DOT_COLORS.green },
  { size: 16, color: DOT_COLORS.purple },
  { size: 10, color: DOT_COLORS.pink },
  { size: 18, color: DOT_COLORS.blue },
  { size: 14, color: DOT_COLORS.yellow },
  { size: 12, color: DOT_COLORS.green },
  { size: 16, color: DOT_COLORS.purple },
];

function DotRow({ dots }: { dots: { size: number; color: string }[] }) {
  return (
    <View style={styles.dotRow}>
      {dots.map((dot, index) => (
        <View
          key={index}
          style={{
            width: dot.size,
            height: dot.size,
            borderRadius: dot.size / 2,
            backgroundColor: dot.color,
          }}
        />
      ))}
    </View>
  );
}

type Props = { navigation: ScreenNavigationProp<'Menu'> };

export const MenuDesign32: React.FC<Props> = ({ navigation }) => {
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
          onPress={menu.handleBack}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={26} color="#c9b1ff" />
        </TouchableOpacity>

        {/* Top Dot Row */}
        <DotRow dots={DOT_ROW_TOP} />

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Pet Care</Text>
          <Text style={styles.subtitle}>Dots of fun</Text>
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
              <Feather name="log-out" size={20} color="#c9b1ff" />
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
              <Feather name="heart" size={28} color="#ffffff" />
            </View>
            <Text style={styles.heroPetName}>{pet.name}</Text>
            <Text style={styles.heroTagline}>Keep playing</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.heroCardNoPet}
            onPress={menu.handleNewPet}
            activeOpacity={0.85}
          >
            <View style={styles.heroIconRow}>
              <Feather name="plus-circle" size={28} color="#333333" />
            </View>
            <Text style={styles.heroNoPetText}>New friend</Text>
          </TouchableOpacity>
        )}

        {/* Bottom Dot Row */}
        <DotRow dots={DOT_ROW_BOTTOM} />

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
          <Feather name="trash-2" size={16} color="#ef5350" />
          <Text style={styles.deleteText}>{t('deleteAccount') || 'Delete Account'}</Text>
        </TouchableOpacity>
      </ScrollView>

      <MenuModals {...menu} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  /* Container */
  container: {
    flex: 1,
    backgroundColor: '#ffecd2',
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
    shadowColor: '#c9b1ff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },

  /* Dot Row */
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 14,
  },

  /* Title */
  titleContainer: {
    alignItems: 'center',
    marginBottom: 22,
    marginTop: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#7c5cbf',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff9a9e',
    marginTop: 4,
    letterSpacing: 0.3,
  },

  /* Profile Card */
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#a1c4fd',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#a1c4fd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
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
    backgroundColor: '#ff9a9e',
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
    backgroundColor: '#96e6a1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 4,
  },
  guestBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333333',
  },
  signOutButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(201, 177, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Hero Card -- With Pet */
  heroCardWithPet: {
    backgroundColor: '#a1c4fd',
    borderRadius: 26,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#a1c4fd',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
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
    backgroundColor: '#96e6a1',
    borderRadius: 26,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#96e6a1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  heroNoPetText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333333',
    marginTop: 6,
  },

  /* Language Card */
  languageCard: {
    backgroundColor: '#ffeaa7',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#ffeaa7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
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
    color: '#ef5350',
  },
});
