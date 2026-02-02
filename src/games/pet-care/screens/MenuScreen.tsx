import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Image,
    Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePet } from '../context/PetContext';
import { useAuth } from '../../../app/context/AuthContext';
import { ConfirmModal } from '../../../app/components/ConfirmModal';
import { LanguageSelector } from '../../../app/components/LanguageSelector';
import { ScreenNavigationProp } from '../../../app/types/navigation';

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
            {/* User Info Header */}
            <View style={styles.header}>
                <View style={styles.userInfoContainer}>
                    {user?.photo && (
                        <Image
                            source={{ uri: user.photo }}
                            style={styles.userPhoto}
                        />
                    )}
                    <View style={styles.userTextContainer}>
                        <Text style={styles.userName}>
                            {user ? `Welcome, ${user.name}` : 'Guest User'}
                        </Text>
                        {user?.email && (
                            <Text style={styles.userEmail}>{user.email}</Text>
                        )}
                    </View>
                </View>

                {!isGuest && (
                    <TouchableOpacity
                        style={styles.signOutButton}
                        onPress={handleSignOut}
                    >
                        <Text style={styles.signOutButtonText}>Sign Out</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Guest Login Prompt */}
            {isGuest && (
                <View style={styles.guestBannerContainer}>
                    <Text style={styles.guestBannerText}>
                        Login to save your progress online
                    </Text>
                </View>
            )}

            <View style={styles.content}>
                <Text style={styles.title}>{t('menu.title')}</Text>
                <Text style={styles.subtitle}>{t('menu.subtitle')}</Text>

        {/* Language Selector */}
        <View style={styles.languageContainer}>
          <LanguageSelector />
        </View>

        <View style={styles.buttonContainer}>
          {pet && (
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              accessibilityRole="button"
              accessibilityLabel={t('menu.continueWith', {
                name: pet.name,
                emoji: pet.type === 'cat' ? '🐱' : '🐶',
              })}
              accessibilityHint={t('menu.continueHint')}
            >
              <Text style={styles.continueButtonText}>
                {t('menu.continueWith', {
                  name: pet.name,
                  emoji: pet.type === 'cat' ? '🐱' : '🐶',
                })}
              </Text>
            </TouchableOpacity>
          )}

          {!pet && (
            <TouchableOpacity
              style={styles.newPetButton}
              onPress={handleNewPet}
              accessibilityRole="button"
              accessibilityLabel={t('menu.createNewPet')}
              accessibilityHint={t('menu.createPetHint')}
            >
              <Text style={styles.newPetButtonText}>{t('menu.createNewPet')}</Text>
            </TouchableOpacity>
          )}

          {pet && (
            <TouchableOpacity
              style={styles.deletePetButton}
              onPress={handleDeletePet}
              accessibilityRole="button"
              accessibilityLabel={t('menu.deletePet')}
              accessibilityHint={t('menu.deletePetHint')}
            >
              <Text style={styles.deletePetButtonText}>{t('menu.deletePet')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

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
    header: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    userPhoto: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    userTextContainer: {
        flex: 1,
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
    },
    userEmail: {
        fontSize: 12,
        color: '#999999',
        marginTop: 2,
    },
    signOutButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        backgroundColor: '#f5f0ff',
        borderWidth: 1,
        borderColor: '#9b59b6',
    },
    signOutButtonText: {
        color: '#9b59b6',
        fontSize: 12,
        fontWeight: '500',
    },
    guestBannerContainer: {
        backgroundColor: '#fff3cd',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ffc107',
    },
    guestBannerText: {
        color: '#856404',
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#9b59b6',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 24,
    },
    languageContainer: {
        marginBottom: 24,
    },
    buttonContainer: {
        width: '100%',
    },
    continueButton: {
        backgroundColor: '#9b59b6',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#9b59b6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 16,
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    newPetButton: {
        backgroundColor: '#9b59b6',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#9b59b6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 16,
    },
    newPetButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    deletePetButton: {
        backgroundColor: '#fff',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#F44336',
        shadowOpacity: 0.1,
    },
    deletePetButtonText: {
        color: '#F44336',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
