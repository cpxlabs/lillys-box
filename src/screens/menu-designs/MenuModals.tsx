import React from 'react';
import { TFunction } from 'i18next';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Pet } from '../../types';

type Props = {
  t: TFunction;
  pet: Pet | null;
  showNewPetConfirm: boolean;
  setShowNewPetConfirm: (v: boolean) => void;
  showDeletePetConfirm: boolean;
  setShowDeletePetConfirm: (v: boolean) => void;
  showSignOutConfirm: boolean;
  setShowSignOutConfirm: (v: boolean) => void;
  handleConfirmNewPet: () => void;
  handleConfirmDeletePet: () => void;
  handleConfirmSignOut: () => void;
};

export const MenuModals: React.FC<Props> = ({
  t,
  pet,
  showNewPetConfirm,
  setShowNewPetConfirm,
  showDeletePetConfirm,
  setShowDeletePetConfirm,
  showSignOutConfirm,
  setShowSignOutConfirm,
  handleConfirmNewPet,
  handleConfirmDeletePet,
  handleConfirmSignOut,
}) => (
  <>
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
  </>
);
