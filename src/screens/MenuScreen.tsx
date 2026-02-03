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
import { Feather } from '@expo/vector-icons'; // Assuming Expo environment with vector icons

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back to Game Selection */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('GameSelection')}
          accessibilityRole="button"
          accessibilityLabel="Back to games"
        >
          <Feather name="chevron-left" size={24} color="#9b59b6" />
        </TouchableOpacity>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {user?.photo ? (
                <Image source={{ uri: user.photo }} style={styles.avatar} />
              ) : (
                <View style={styles.defaultAvatar}>
                  <Text style={styles.defaultAvatarText}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {user ? user.name : 'Guest User'}
              </Text>
              {user?.email && (
                <Text style={styles.userEmail} numberOfLines={1}>
                  {user.email}
                </Text>
              )}
              {isGuest && (
                <View style={styles.guestBadge}>
                  <Text style={styles.guestBadgeText}>Guest Mode</Text>
                </View>
              )}
            </View>
            {!isGuest && (
              <TouchableOpacity
                style={styles.signOutButton}
                onPress={handleSignOut}
                accessibilityRole="button"
                accessibilityLabel="Sign Out"
              >
                <Feather name="log-out" size={20} color="#9b59b6" />
              </TouchableOpacity>
            )}
          </View>

          {isGuest && (
            <View style={styles.guestMessage}>
              <Text style={styles.guestMessageText}>
                Login to save your progress online
              </Text>
            </View>
          )}
        </View>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('menu.title')}</Text>
          <Text style={styles.subtitle}>{t('menu.subtitle')}</Text>
        </View>

        {/* Main Actions */}
        <View style={styles.actionContainer}>
          {pet ? (
            <TouchableOpacity
              style={styles.heroCard}
              onPress={handleContinue}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel={t('menu.continueWith', {
                name: pet.name,
                emoji: pet.type === 'cat' ? '🐱' : '🐶',
              })}
              accessibilityHint={t('menu.continueHint')}
            >
              <View style={styles.heroContent}>
                <Text style={styles.heroEmoji}>
                  {pet.type === 'cat' ? '🐱' : '🐶'}
                </Text>
                <View style={styles.heroTextContainer}>
                  <Text style={styles.heroTitle}>{pet.name}</Text>
                  <Text style={styles.heroSubtitle}>
                    {t('menu.continueHint')}
                  </Text>
                </View>
                <Feather name="chevron-right" size={32} color="#fff" style={styles.heroIcon} />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.heroCard}
              onPress={handleNewPet}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel={t('menu.createNewPet')}
              accessibilityHint={t('menu.createPetHint')}
            >
              <View style={styles.heroContent}>
                <Text style={styles.heroEmoji}>✨</Text>
                <View style={styles.heroTextContainer}>
                  <Text style={styles.heroTitle}>{t('menu.createNewPet')}</Text>
                  <Text style={styles.heroSubtitle}>Start a new adventure</Text>
                </View>
                <Feather name="plus-circle" size={32} color="#fff" style={styles.heroIcon} />
              </View>
            </TouchableOpacity>
          )}

          {/* Secondary Actions Grid */}
          <View style={styles.secondaryActions}>
            <View style={styles.languageCard}>
               <LanguageSelector />
            </View>

            {pet && (
              <TouchableOpacity
                style={styles.deleteCard}
                onPress={handleDeletePet}
                accessibilityRole="button"
                accessibilityLabel={t('menu.deletePet')}
                accessibilityHint={t('menu.deletePetHint')}
              >
                <Feather name="trash-2" size={20} color="#FF6B6B" />
                <Text style={styles.deleteText}>{t('common.delete')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
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
    backgroundColor: '#f5f0ff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  // Profile Card
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#f0e6ff',
  },
  defaultAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0e6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9b59b6',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
  },
  guestBadge: {
    backgroundColor: '#fff3cd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  guestBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#856404',
  },
  signOutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestMessage: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  guestMessageText: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
  },
  // Title
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#9b59b6',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  // Actions
  actionContainer: {
    gap: 16,
  },
  heroCard: {
    backgroundColor: '#9b59b6',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#9b59b6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    width: '100%',
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 48,
    marginRight: 20,
  },
  heroTextContainer: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  heroIcon: {
    opacity: 0.8,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  languageCard: {
    flex: 1,
    // Language selector usually has its own styling, but we wrap it to align
    justifyContent: 'center',
  },
  deleteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffebeb',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteText: {
    color: '#FF6B6B',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
});
