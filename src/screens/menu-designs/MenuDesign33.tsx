import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LanguageSelector } from '../../components/LanguageSelector';
import { useMenuLogic } from './useMenuLogic';
import { MenuModals } from './MenuModals';
import { ScreenNavigationProp } from '../../types/navigation';

const LEAF_OPACITIES = [0.3, 0.5, 0.7, 0.5, 0.3];

function LeafRow() {
  return (
    <View style={styles.leafRow}>
      {LEAF_OPACITIES.map((opacity, index) => (
        <View
          key={index}
          style={[
            styles.leaf,
            { opacity },
          ]}
        />
      ))}
    </View>
  );
}

function RopeSeparator() {
  return <View style={styles.ropeSeparator} />;
}

type Props = { navigation: ScreenNavigationProp<'Menu'> };

export const MenuDesign33: React.FC<Props> = ({ navigation }) => {
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
          <Feather name="arrow-left" size={26} color="#6b4226" />
        </TouchableOpacity>

        {/* Leaf Decoration Row */}
        <LeafRow />

        {/* Wooden Plank Title */}
        <View style={styles.titlePlank}>
          <Text style={styles.title}>Pet Care</Text>
          <Text style={styles.subtitle}>Your secret hideout</Text>
        </View>

        {/* Rope Separator */}
        <RopeSeparator />

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
              <Feather name="log-out" size={20} color="#b5854b" />
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
              <Feather name="home" size={28} color="#ffffff" />
            </View>
            <Text style={styles.heroPetName}>{pet.name}</Text>
            <Text style={styles.heroTagline}>Climb up</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.heroCardNoPet}
            onPress={menu.handleNewPet}
            activeOpacity={0.85}
          >
            <View style={styles.heroIconRow}>
              <Feather name="plus" size={28} color="#6b4226" />
            </View>
            <Text style={styles.heroNoPetText}>Build your treehouse</Text>
          </TouchableOpacity>
        )}

        {/* Rope Separator */}
        <RopeSeparator />

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
    backgroundColor: '#e8f0e3',
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
    borderRadius: 12,
    backgroundColor: '#f5e6cc',
    borderWidth: 2,
    borderColor: '#b5854b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#6b4226',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  /* Leaf Decoration */
  leafRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    gap: 12,
  },
  leaf: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#68a357',
  },

  /* Wooden Plank Title */
  titlePlank: {
    backgroundColor: '#deb887',
    borderWidth: 2,
    borderColor: '#6b4226',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#6b4226',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#6b4226',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#68a357',
    marginTop: 4,
    letterSpacing: 0.3,
  },

  /* Rope Separator */
  ropeSeparator: {
    height: 3,
    backgroundColor: '#d4a76a',
    borderRadius: 1.5,
    width: '80%',
    alignSelf: 'center',
    marginVertical: 18,
  },

  /* Profile Card */
  profileCard: {
    backgroundColor: '#f5e6cc',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#b5854b',
    padding: 18,
    marginBottom: 16,
    shadowColor: '#6b4226',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
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
    backgroundColor: '#68a357',
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
    color: '#6b4226',
  },
  guestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#c5e1f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 4,
  },
  guestBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b4226',
  },
  signOutButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(181, 133, 75, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Hero Card -- With Pet */
  heroCardWithPet: {
    backgroundColor: '#68a357',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#b5854b',
    shadowColor: '#6b4226',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
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
    color: 'rgba(255, 255, 255, 0.8)',
  },

  /* Hero Card -- No Pet */
  heroCardNoPet: {
    backgroundColor: '#c5e1f5',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#b5854b',
    shadowColor: '#6b4226',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  heroNoPetText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#6b4226',
    marginTop: 6,
  },

  /* Language Card */
  languageCard: {
    backgroundColor: '#c5e1f5',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#b5854b',
    padding: 18,
    marginBottom: 16,
    shadowColor: '#6b4226',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },

  /* Delete Button */
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c47070',
  },
});
