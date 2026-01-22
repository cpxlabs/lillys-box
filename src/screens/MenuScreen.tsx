import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePet } from '../context/PetContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { LanguageSelector } from '../components/LanguageSelector';
import { ScreenNavigationProp } from '../types/navigation';

type Props = {
    navigation: ScreenNavigationProp<'Menu'>;
};

export const MenuScreen: React.FC<Props> = ({ navigation }) => {
    const { pet, removePet } = usePet();
    const { t } = useTranslation();
    const [showNewPetConfirm, setShowNewPetConfirm] = useState(false);
    const [showDeletePetConfirm, setShowDeletePetConfirm] = useState(false);

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

    return (
        <SafeAreaView style={styles.container}>
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
                        >
                            <Text style={styles.continueButtonText}>
                                {t('menu.continueWith', { name: pet.name, emoji: pet.type === 'cat' ? '🐱' : '🐶' })}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {!pet && (
                        <TouchableOpacity
                            style={styles.newPetButton}
                            onPress={handleNewPet}
                        >
                            <Text style={styles.newPetButtonText}>
                                {t('menu.createNewPet')}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {pet && (
                        <TouchableOpacity
                            style={styles.deletePetButton}
                            onPress={handleDeletePet}
                        >
                            <Text style={styles.deletePetButtonText}>
                                {t('menu.deletePet')}
                            </Text>
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f0ff',
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
