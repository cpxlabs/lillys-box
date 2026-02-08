import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LanguageSelector } from '../../components/LanguageSelector';
import { useMenuLogic } from './useMenuLogic';
import { MenuModals } from './MenuModals';
import { ScreenNavigationProp } from '../../types/navigation';

const PATCH_COLORS = ['#f4a5a5', '#a5c8e4', '#a5d6a7', '#fff59d', '#ce93d8'];

function QuiltStrip() {
  return (
    <View style={styles.quiltStrip}>
      {PATCH_COLORS.map((color, index) => (
        <View
          key={index}
          style={[
            styles.quiltSquare,
            { backgroundColor: color },
          ]}
        />
      ))}
    </View>
  );
}

type Props = { navigation: ScreenNavigationProp<'Menu'> };

export const MenuDesign37: React.FC<Props> = ({ navigation }) => {
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
          <Feather name="chevron-left" size={26} color="#c0606b" />
        </TouchableOpacity>

        {/* Quilt Strip Decoration */}
        <QuiltStrip />

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Pet Care</Text>
          <Text style={styles.subtitle}>Warm and cozy</Text>
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
              <Feather name="log-out" size={20} color="#999" />
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
            <Text style={styles.heroTagline}>Snuggle in</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.heroCardNoPet}
            onPress={menu.handleNewPet}
            activeOpacity={0.85}
          >
            <View style={styles.heroIconRow}>
              <Feather name="plus" size={28} color="#ffffff" />
            </View>
            <Text style={styles.heroNoPetText}>Stitch your pet</Text>
          </TouchableOpacity>
        )}

        {/* Quilt Strip Decoration */}
        <QuiltStrip />

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
          <Feather name="trash-2" size={16} color="#c0606b" />
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
    backgroundColor: '#fdf6ec',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },

  /* Quilt Strip */
  quiltStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginVertical: 14,
  },
  quiltSquare: {
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#999',
  },

  /* Back Button */
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e0c4c6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: '#c0606b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  /* Title */
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#c0606b',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6a9bc3',
    marginTop: 4,
    letterSpacing: 0.3,
  },

  /* Profile Card */
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#cccccc',
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#a5d6a7',
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
    color: '#444444',
  },
  guestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff59d',
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#e0d56c',
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 4,
  },
  guestBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7a6e1e',
  },
  signOutButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f7f1e6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Hero Card -- With Pet */
  heroCardWithPet: {
    backgroundColor: '#a5c8e4',
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#7a9fc0',
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#7a9fc0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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
    backgroundColor: '#f4a5a5',
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d48a8a',
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#d48a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  heroNoPetText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 6,
  },

  /* Language Card */
  languageCard: {
    backgroundColor: '#fff59d',
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e0d56c',
    padding: 18,
    marginBottom: 16,
    shadowColor: '#e0d56c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
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
    color: '#c0606b',
  },
});
