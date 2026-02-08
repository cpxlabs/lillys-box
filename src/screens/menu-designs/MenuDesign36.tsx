import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LanguageSelector } from '../../components/LanguageSelector';
import { useMenuLogic } from './useMenuLogic';
import { MenuModals } from './MenuModals';
import { ScreenNavigationProp } from '../../types/navigation';

/* ------------------------------------------------------------------ */
/*  MusicNote                                                         */
/*  A circle (note head) at the bottom with a thin stem going up      */
/*  from the right side.                                              */
/* ------------------------------------------------------------------ */
function MusicNote({ color }: { color: string }) {
  return (
    <View style={noteStyles.wrapper}>
      {/* Stem extending up from the right edge of the head */}
      <View style={[noteStyles.stem, { backgroundColor: color }]} />
      {/* Note head */}
      <View style={[noteStyles.head, { backgroundColor: color }]} />
    </View>
  );
}

const noteStyles = StyleSheet.create({
  wrapper: {
    width: 14,
    height: 30,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  stem: {
    width: 2,
    height: 18,
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: 1,
  },
  head: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

/* ------------------------------------------------------------------ */
/*  StaffLines                                                        */
/*  Five horizontal lines stacked with a 4px gap, like a music staff. */
/* ------------------------------------------------------------------ */
function StaffLines() {
  return (
    <View style={staffStyles.container}>
      {[0, 1, 2, 3, 4].map((i) => (
        <View key={i} style={staffStyles.line} />
      ))}
    </View>
  );
}

const staffStyles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 4,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#d1d5db',
  },
});

/* ------------------------------------------------------------------ */
/*  Main Component                                                    */
/* ------------------------------------------------------------------ */
type Props = { navigation: ScreenNavigationProp<'Menu'> };

export const MenuDesign36: React.FC<Props> = ({ navigation }) => {
  const menu = useMenuLogic(navigation);
  const { pet, user, isGuest, t } = menu;
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ---- Back Button ---- */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={menu.handleBack}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={26} color="#7c3aed" />
        </TouchableOpacity>

        {/* ---- Staff Lines with Notes ---- */}
        <View style={styles.staffWithNotes}>
          <StaffLines />
          <View style={styles.notesOverlay}>
            <View style={[styles.notePosition, { left: '15%' }]}>
              <MusicNote color="#7c3aed" />
            </View>
            <View style={[styles.notePosition, { left: '48%' }]}>
              <MusicNote color="#ec4899" />
            </View>
            <View style={[styles.notePosition, { left: '78%' }]}>
              <MusicNote color="#3b82f6" />
            </View>
          </View>
        </View>

        {/* ---- Title ---- */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Pet Care</Text>
          <Text style={styles.subtitle}>A happy melody</Text>
        </View>

        {/* ---- Profile Card ---- */}
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
              <Feather name="log-out" size={20} color="#7c3aed" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ---- Hero Card ---- */}
        {pet ? (
          <TouchableOpacity
            style={styles.heroCardWithPet}
            onPress={menu.handleContinue}
            activeOpacity={0.85}
          >
            <View style={styles.heroIconRow}>
              <Feather name="music" size={28} color="#ffffff" />
            </View>
            <Text style={styles.heroPetName}>{pet.name}</Text>
            <Text style={styles.heroTagline}>Play on</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.heroCardNoPet}
            onPress={menu.handleNewPet}
            activeOpacity={0.85}
          >
            <View style={styles.heroIconRow}>
              <Feather name="plus-circle" size={28} color="#ffffff" />
            </View>
            <Text style={styles.heroNoPetText}>Compose your pet</Text>
          </TouchableOpacity>
        )}

        {/* ---- Staff Lines Decoration ---- */}
        <View style={styles.staffDecoration}>
          <StaffLines />
        </View>

        {/* ---- Language Card ---- */}
        <View style={styles.languageCard}>
          <LanguageSelector />
        </View>

        {/* ---- Delete Account ---- */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={menu.handleDeletePet}
          activeOpacity={0.7}
        >
          <Feather name="trash-2" size={16} color="#ec4899" />
          <Text style={styles.deleteText}>{t('deleteAccount') || 'Delete Account'}</Text>
        </TouchableOpacity>
      </ScrollView>

      <MenuModals {...menu} />
    </SafeAreaView>
  );
};

/* ------------------------------------------------------------------ */
/*  Styles                                                            */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
  /* ---- Root ---- */
  container: {
    flex: 1,
    backgroundColor: '#f3e8ff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },

  /* ---- Back Button ---- */
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  /* ---- Staff with Notes ---- */
  staffWithNotes: {
    position: 'relative',
    marginBottom: 20,
    paddingVertical: 8,
  },
  notesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  notePosition: {
    position: 'absolute',
    top: -6,
  },

  /* ---- Title ---- */
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#7c3aed',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ec4899',
    marginTop: 4,
    letterSpacing: 0.3,
  },

  /* ---- Profile Card ---- */
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(124, 58, 237, 0.2)',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
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
    backgroundColor: '#14b8a6',
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
    color: '#1f2937',
  },
  guestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ec4899',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 4,
  },
  guestBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  signOutButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(124, 58, 237, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ---- Hero Card -- With Pet ---- */
  heroCardWithPet: {
    backgroundColor: '#7c3aed',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#7c3aed',
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

  /* ---- Hero Card -- No Pet ---- */
  heroCardNoPet: {
    backgroundColor: '#14b8a6',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#14b8a6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  heroNoPetText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 6,
  },

  /* ---- Staff Decoration ---- */
  staffDecoration: {
    marginVertical: 16,
  },

  /* ---- Language Card ---- */
  languageCard: {
    backgroundColor: '#14b8a6',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#14b8a6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },

  /* ---- Delete Button ---- */
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
    color: '#ec4899',
  },
});
