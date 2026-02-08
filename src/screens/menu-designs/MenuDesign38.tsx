import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LanguageSelector } from '../../components/LanguageSelector';
import { useMenuLogic } from './useMenuLogic';
import { MenuModals } from './MenuModals';
import { ScreenNavigationProp } from '../../types/navigation';

/* ------------------------------------------------------------------ */
/*  Kite: rotated square with a string line hanging below              */
/* ------------------------------------------------------------------ */
function Kite({ color, size }: { color: string; size: number }) {
  return (
    <View style={kiteStyles.wrapper}>
      <View
        style={[
          kiteStyles.diamond,
          {
            width: size,
            height: size,
            backgroundColor: color,
          },
        ]}
      />
      <View style={kiteStyles.string} />
    </View>
  );
}

const kiteStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  diamond: {
    borderRadius: 3,
    transform: [{ rotate: '45deg' }],
  },
  string: {
    width: 1.5,
    height: 20,
    backgroundColor: '#a3816a',
    marginTop: 2,
  },
});

/* ------------------------------------------------------------------ */
/*  KiteTail: three small bows along an invisible string               */
/* ------------------------------------------------------------------ */
const BOW_COLORS = ['#ef4444', '#f97316', '#06b6d4'];

function KiteTail() {
  return (
    <View style={tailStyles.container}>
      {BOW_COLORS.map((c, i) => (
        <View key={i} style={[tailStyles.bow, { backgroundColor: c, marginTop: i * 6 }]} />
      ))}
    </View>
  );
}

const tailStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: -2,
  },
  bow: {
    width: 8,
    height: 4,
    borderRadius: 2,
  },
});

/* ------------------------------------------------------------------ */
/*  WindLines: thin grey lines to suggest a breeze                     */
/* ------------------------------------------------------------------ */
function WindLines({ widths }: { widths: number[] }) {
  return (
    <View style={styles.windRow}>
      {widths.map((w, i) => (
        <View key={i} style={[styles.windLine, { width: w }]} />
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/*  MenuDesign38 -- "Kite Flying"                                      */
/* ------------------------------------------------------------------ */
type Props = { navigation: ScreenNavigationProp<'Menu'> };

export const MenuDesign38: React.FC<Props> = ({ navigation }) => {
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
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={26} color="#06b6d4" />
        </TouchableOpacity>

        {/* ---- Kite Row ---- */}
        <View style={styles.kiteRow}>
          <View style={{ marginTop: -10 }}>
            <Kite color="#ef4444" size={28} />
            <KiteTail />
          </View>
          <View style={{ marginTop: 5 }}>
            <Kite color="#f97316" size={22} />
            <KiteTail />
          </View>
          <View style={{ marginTop: -5 }}>
            <Kite color="#06b6d4" size={26} />
            <KiteTail />
          </View>
        </View>

        {/* ---- Title ---- */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Pet Care</Text>
          <Text style={styles.subtitle}>Let your spirits fly</Text>
        </View>

        {/* ---- Wind Lines ---- */}
        <WindLines widths={[30, 50, 40]} />

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
              <Feather name="log-out" size={20} color="#64748b" />
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
              <Feather name="wind" size={28} color="#ffffff" />
            </View>
            <Text style={styles.heroPetName}>{pet.name}</Text>
            <Text style={styles.heroTagline}>Soar high</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.heroCardNoPet}
            onPress={menu.handleNewPet}
            activeOpacity={0.85}
          >
            <View style={styles.heroIconRow}>
              <Feather name="plus-circle" size={28} color="#333333" />
            </View>
            <Text style={styles.heroNoPetText}>Create your pet</Text>
          </TouchableOpacity>
        )}

        {/* ---- Wind Lines + Small Kite Decoration ---- */}
        <View style={styles.decorRow}>
          <WindLines widths={[40, 30]} />
          <View style={styles.decorKiteWrap}>
            <Kite color="#84cc16" size={16} />
          </View>
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
          <Feather name="trash-2" size={16} color="#ef4444" />
          <Text style={styles.deleteText}>{t('deleteAccount') || 'Delete Account'}</Text>
        </TouchableOpacity>
      </ScrollView>

      <MenuModals {...menu} />
    </SafeAreaView>
  );
};

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
  /* ---------- Root ---------- */
  container: {
    flex: 1,
    backgroundColor: '#e0f2fe',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },

  /* ---------- Back Button ---------- */
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#0c4a6e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
  },

  /* ---------- Kite Row ---------- */
  kiteRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 30,
    marginBottom: 10,
    marginTop: 4,
  },

  /* ---------- Title ---------- */
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0891b2',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f97316',
    marginTop: 4,
    letterSpacing: 0.3,
  },

  /* ---------- Wind Lines ---------- */
  windRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    marginVertical: 12,
  },
  windLine: {
    height: 1.5,
    backgroundColor: '#94a3b8',
    borderRadius: 1,
  },

  /* ---------- Profile Card ---------- */
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#0c4a6e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#84cc16',
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
    color: '#1e293b',
  },
  guestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f97316',
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
    backgroundColor: 'rgba(148,163,184,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ---------- Hero Card -- With Pet ---------- */
  heroCardWithPet: {
    backgroundColor: '#ef4444',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#b91c1c',
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
    color: 'rgba(255,255,255,0.80)',
  },

  /* ---------- Hero Card -- No Pet ---------- */
  heroCardNoPet: {
    backgroundColor: '#84cc16',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#4d7c0f',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.20,
    shadowRadius: 12,
    elevation: 6,
  },
  heroNoPetText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333333',
    marginTop: 6,
  },

  /* ---------- Decoration Row ---------- */
  decorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 12,
  },
  decorKiteWrap: {
    marginTop: -4,
  },

  /* ---------- Language Card ---------- */
  languageCard: {
    backgroundColor: '#fff7ed',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.25)',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#9a3412',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  /* ---------- Delete Button ---------- */
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
});
