import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePet } from '../context/PetContext';
import { useAuth } from '../context/AuthContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { LanguageSelector } from '../components/LanguageSelector';
import { ScreenNavigationProp } from '../types/navigation';
import { WebSafeIcon } from '../components/WebSafeIcon';

const PATCH_COLORS = ['#f4a5a5', '#a5c8e4', '#a5d6a7', '#fff59d', '#ce93d8'];

function QuiltStrip() {
  return (
    <View style={styles.quiltStrip}>
      {PATCH_COLORS.map((color, index) => (
        <View
          key={index}
          style={[styles.quiltSquare, { backgroundColor: color }]}
        />
      ))}
    </View>
  );
}

type Props = {
  navigation: ScreenNavigationProp<'Menu'>;
};

export const MenuScreen: React.FC<Props> = ({ navigation }) => {
  const { pet, removePet } = usePet();
  const { user, isGuest, signOut } = useAuth();
  const { t } = useTranslation();
  const [showNewPetConfirm, setShowNewPetConfirm] = useState(false);
  const [showDeletePetConfirm, setShowDeletePetConfirm] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const handleContinue = () => {
    if (pet) {
      navigation.navigate('Home');
    }
  };

  const handleNewPet = () => {
    if (pet) {
      setShowNewPetConfirm(true);
    } else {
      navigation.navigate('CreatePet');
    }
  };

  const handleConfirmNewPet = async () => {
    setShowNewPetConfirm(false);
    await removePet();
    navigation.navigate('CreatePet');
  };

  const handleDeletePet = () => {
    if (pet) {
      setShowDeletePetConfirm(true);
    }
  };

  const handleConfirmDeletePet = async () => {
    setShowDeletePetConfirm(false);
    await removePet();
  };

  const handleSignOut = () => {
    setShowSignOutConfirm(true);
  };

  const handleConfirmSignOut = async () => {
    setShowSignOutConfirm(false);
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

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
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.getParent()?.goBack();
            }
          }}
          accessibilityRole="button"
          accessibilityLabel="Back to games"
        >
          <WebSafeIcon name="arrow-left" size={22} color="#c0606b" />
        </TouchableOpacity>

        {/* Quilt Strip Decoration */}
        <QuiltStrip />

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('menu.title')}</Text>
          <Text style={styles.subtitle}>{t('menu.subtitle')}</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarCircle}>
              {user?.photo ? (
                <Image source={{ uri: user.photo }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarInitial}>{userInitial}</Text>
              )}
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
              {user?.email && !isGuest && (
                <Text style={styles.profileEmail} numberOfLines={1}>
                  {user.email}
                </Text>
              )}
            </View>
            {!isGuest ? (
              <TouchableOpacity
                style={styles.signOutPatch}
                onPress={handleSignOut}
                accessibilityRole="button"
                accessibilityLabel="Sign Out"
              >
                <WebSafeIcon name="log-out" size={18} color="#c0606b" />
              </TouchableOpacity>
            ) : (
              <View style={styles.decorativePatch}>
                <WebSafeIcon name="user" size={18} color="#bbb" />
              </View>
            )}
          </View>
        </View>

        {/* Hero Action */}
        {pet ? (
          <TouchableOpacity
            style={styles.heroCardWithPet}
            onPress={handleContinue}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={t('menu.continueWith', {
              name: pet.name,
              emoji: pet.type === 'cat' ? '🐱' : '🐶',
            })}
            accessibilityHint={t('menu.continueHint')}
          >
            <View style={styles.heroContent}>
              <WebSafeIcon name="heart" size={24} color="#fff" style={styles.heroIcon} />
              <Text style={styles.heroText}>{pet.name}</Text>
              <WebSafeIcon name="chevron-right" size={24} color="rgba(255,255,255,0.7)" />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.heroCardNoPet}
            onPress={handleNewPet}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={t('menu.createNewPet')}
            accessibilityHint={t('menu.createPetHint')}
          >
            <Text style={styles.heroText}>{t('menu.stitchYourPet')}</Text>
          </TouchableOpacity>
        )}

        {/* New Pet Button (when pet exists) */}
        {pet && (
          <TouchableOpacity
            style={styles.newPetButton}
            onPress={handleNewPet}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={t('menu.createNewPet')}
          >
            <WebSafeIcon name="plus-circle" size={18} color="#6a9bc3" />
            <Text style={styles.newPetText}>{t('menu.createNewPet')}</Text>
          </TouchableOpacity>
        )}

        {/* Quilt Strip Decoration */}
        <QuiltStrip />

        {/* Language Card */}
        <View style={styles.languageCard}>
          <LanguageSelector />
        </View>

        {/* Delete Account */}
        {pet && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeletePet}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={t('menu.deletePet')}
          >
            <Text style={styles.deleteText}>{t('deleteAccount')}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Modals */}
      <ConfirmModal
        visible={showNewPetConfirm}
        title={t('menu.createPetModal.title')}
        message={pet ? t('menu.createPetModal.message', { name: pet.name }) : ''}
        confirmText={t('menu.createPetModal.confirmText')}
        cancelText={t('menu.createPetModal.cancelText')}
        confirmStyle="destructive"
        onConfirm={handleConfirmNewPet}
        onCancel={() => setShowNewPetConfirm(false)}
      />

      <ConfirmModal
        visible={showDeletePetConfirm}
        title={t('menu.deletePetModal.title')}
        message={pet ? t('menu.deletePetModal.message', { name: pet.name }) : ''}
        confirmText={t('menu.deletePetModal.confirmText')}
        cancelText={t('menu.deletePetModal.cancelText')}
        confirmStyle="destructive"
        onConfirm={handleConfirmDeletePet}
        onCancel={() => setShowDeletePetConfirm(false)}
      />

      <ConfirmModal
        visible={showSignOutConfirm}
        title="Sign Out"
        message="Are you sure you want to sign out? Your pet data will be preserved."
        confirmText="Sign Out"
        cancelText="Cancel"
        confirmStyle="destructive"
        onConfirm={handleConfirmSignOut}
        onCancel={() => setShowSignOutConfirm(false)}
      />
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
    borderRadius: 22,
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  profileEmail: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
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
  signOutPatch: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fdf0f0',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#e0c4c6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorativePatch: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f5efe6',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Hero Card -- With Pet */
  heroCardWithPet: {
    backgroundColor: '#a5c8e4',
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#7a9fc0',
    paddingVertical: 22,
    paddingHorizontal: 24,
    marginBottom: 12,
    shadowColor: '#7a9fc0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIcon: {
    marginRight: 10,
  },
  heroText: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
  },

  /* Hero Card -- No Pet */
  heroCardNoPet: {
    backgroundColor: '#f4a5a5',
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d48a8a',
    paddingVertical: 26,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#d48a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  /* New Pet Button (secondary, when pet exists) */
  newPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
    marginBottom: 4,
  },
  newPetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6a9bc3',
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c0606b',
  },
});
