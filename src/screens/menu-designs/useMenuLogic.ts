import { useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePet } from '../../context/PetContext';
import { useAuth } from '../../context/AuthContext';
import { ScreenNavigationProp } from '../../types/navigation';

export const useMenuLogic = (navigation: ScreenNavigationProp<'Menu'>) => {
  const { pet, removePet } = usePet();
  const { user, isGuest, signOut } = useAuth();
  const { t } = useTranslation();
  const [showNewPetConfirm, setShowNewPetConfirm] = useState(false);
  const [showDeletePetConfirm, setShowDeletePetConfirm] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const handleContinue = () => {
    if (pet) navigation.navigate('Home');
  };

  const handleNewPet = () => {
    if (pet) setShowNewPetConfirm(true);
    else navigation.navigate('CreatePet');
  };

  const handleConfirmNewPet = async () => {
    setShowNewPetConfirm(false);
    await removePet();
    navigation.navigate('CreatePet');
  };

  const handleDeletePet = () => {
    if (pet) setShowDeletePetConfirm(true);
  };

  const handleConfirmDeletePet = async () => {
    setShowDeletePetConfirm(false);
    await removePet();
  };

  const handleSignOut = () => setShowSignOutConfirm(true);

  const handleConfirmSignOut = async () => {
    setShowSignOutConfirm(false);
    try {
      await signOut();
    } catch {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const handleBack = () => navigation.navigate('GameSelection' as never);

  return {
    pet,
    user,
    isGuest,
    t,
    showNewPetConfirm,
    setShowNewPetConfirm,
    showDeletePetConfirm,
    setShowDeletePetConfirm,
    showSignOutConfirm,
    setShowSignOutConfirm,
    handleContinue,
    handleNewPet,
    handleConfirmNewPet,
    handleDeletePet,
    handleConfirmDeletePet,
    handleSignOut,
    handleConfirmSignOut,
    handleBack,
  };
};
