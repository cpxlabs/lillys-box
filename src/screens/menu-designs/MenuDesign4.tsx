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

const petEmojis: Record<string, string> = {
  cat: '\uD83D\uDC31',
  dog: '\uD83D\uDC36',
};

export const MenuDesign4: React.FC<Props> = ({ navigation }) => {
  const menu = useMenuLogic(navigation);
  const { pet, user, isGuest, t } = menu;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={menu.handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Feather name="arrow-left" size={20} color="#111" />
        </TouchableOpacity>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileLeft}>
            <View style={styles.avatar}>
              <Feather name="user" size={20} color="#bbb" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {isGuest ? t('menu.guest') : user?.email?.split('@')[0] ?? t('menu.guest')}
              </Text>
              <Text style={styles.profileEmail}>
                {isGuest ? t('menu.guestDescription') : user?.email ?? ''}
              </Text>
            </View>
          </View>
          {!isGuest && (
            <TouchableOpacity
              onPress={menu.handleSignOut}
              accessibilityRole="button"
              accessibilityLabel="Sign out"
            >
              <Text style={styles.signOutText}>{t('menu.signOut')}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.separator} />

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{t('menu.title')}</Text>
          <Text style={styles.subtitle}>{t('menu.subtitle')}</Text>
        </View>

        {/* Hero Card — Current Pet or Create New */}
        {pet ? (
          <>
            <TouchableOpacity
              style={styles.heroCard}
              onPress={menu.handleContinue}
              activeOpacity={0.6}
              accessibilityRole="button"
              accessibilityLabel={`Continue with ${pet.name}`}
            >
              <Text style={styles.heroEmoji}>{petEmojis[pet.type] ?? '\uD83D\uDC3E'}</Text>
              <View style={styles.heroInfo}>
                <Text style={styles.heroName}>{pet.name}</Text>
                <Text style={styles.heroType}>
                  {pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}
                </Text>
              </View>
              <Feather name="arrow-right" size={18} color="#bbb" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryAction}
              onPress={menu.handleNewPet}
              accessibilityRole="button"
              accessibilityLabel="Create a new pet"
            >
              <Feather name="plus" size={16} color="#888" />
              <Text style={styles.secondaryActionText}>{t('menu.newPet')}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.heroCard}
            onPress={menu.handleNewPet}
            activeOpacity={0.6}
            accessibilityRole="button"
            accessibilityLabel="Create a new pet"
          >
            <Feather name="plus" size={20} color="#888" />
            <View style={styles.heroInfo}>
              <Text style={styles.heroName}>{t('menu.newPet')}</Text>
              <Text style={styles.heroType}>{t('menu.newPetDescription')}</Text>
            </View>
            <Feather name="arrow-right" size={18} color="#bbb" />
          </TouchableOpacity>
        )}

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <View style={styles.separator} />

          <View style={styles.languageRow}>
            <LanguageSelector />
          </View>

          {pet && (
            <TouchableOpacity
              style={styles.deleteRow}
              onPress={menu.handleDeletePet}
              accessibilityRole="button"
              accessibilityLabel="Delete pet"
            >
              <Feather name="trash-2" size={15} color="#c0392b" />
              <Text style={styles.deleteText}>{t('menu.deletePet')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <MenuModals {...menu} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 48,
    flexGrow: 1,
  },

  // Back button
  backButton: {
    alignSelf: 'flex-start',
    padding: 4,
    marginBottom: 32,
  },

  // Profile
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    fontWeight: '300',
    color: '#888',
  },
  signOutText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#888',
    marginLeft: 12,
  },

  // Separator
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 4,
  },

  // Title
  titleSection: {
    marginTop: 32,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: '#111',
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '300',
    color: '#bbb',
  },

  // Hero card
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  heroEmoji: {
    fontSize: 28,
    marginRight: 16,
  },
  heroInfo: {
    flex: 1,
  },
  heroName: {
    fontSize: 15,
    fontWeight: '400',
    color: '#111',
    marginBottom: 2,
  },
  heroType: {
    fontSize: 13,
    fontWeight: '300',
    color: '#888',
  },

  // Secondary action (new pet when pet exists)
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#888',
    marginLeft: 8,
  },

  // Bottom
  bottomSection: {
    marginTop: 'auto' as any,
    paddingTop: 32,
  },
  languageRow: {
    marginTop: 20,
    marginBottom: 16,
  },
  deleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#c0392b',
    marginLeft: 8,
  },
});
