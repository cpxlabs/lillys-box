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

export const MenuDesign8: React.FC<Props> = ({ navigation }) => {
  const menu = useMenuLogic(navigation);
  const { pet, user, isGuest, t, handleContinue, handleNewPet, handleDeletePet, handleSignOut, handleBack } = menu;

  const petEmoji = pet?.type === 'cat' ? '🐱' : pet?.type === 'dog' ? '🐶' : '🐾';
  const petTypeLabel = pet?.type === 'cat' ? 'Cat' : pet?.type === 'dog' ? 'Dog' : '—';
  const displayName = isGuest ? t('menu.guest') : user?.name || 'User';
  const displayEmail = isGuest ? '' : user?.email || '';
  const avatarUri = !isGuest && user?.photo ? user.photo : null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton} accessibilityLabel="Go back">
          <Feather name="arrow-left" size={22} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        {!isGuest ? (
          <TouchableOpacity onPress={handleSignOut} style={styles.headerButton} accessibilityLabel="Sign out">
            <Feather name="log-out" size={20} color="#ffffff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerButton} />
        )}
      </View>

      {/* Profile Strip */}
      <View style={styles.profileStrip}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Feather name="user" size={20} color="#94a3b8" />
          </View>
        )}
        <View style={styles.profileInfo}>
          <View style={styles.profileNameRow}>
            <Text style={styles.profileName} numberOfLines={1}>{displayName}</Text>
            {isGuest && (
              <View style={styles.guestBadge}>
                <Text style={styles.guestBadgeText}>Guest</Text>
              </View>
            )}
          </View>
          {displayEmail ? (
            <Text style={styles.profileEmail} numberOfLines={1}>{displayEmail}</Text>
          ) : null}
        </View>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View style={styles.grid}>
          {/* Card 1: Your Pet */}
          <View style={styles.gridCard}>
            <View style={[styles.cardAccent, { backgroundColor: '#3b82f6' }]} />
            <Text style={styles.cardEmoji}>{petEmoji}</Text>
            <Text style={styles.cardLabel}>Your Pet</Text>
            <Text style={styles.cardValue} numberOfLines={1}>{pet?.name || 'None yet'}</Text>
          </View>

          {/* Card 2: Type */}
          <View style={styles.gridCard}>
            <View style={[styles.cardAccent, { backgroundColor: '#8b5cf6' }]} />
            <View style={styles.cardIconWrap}>
              <Feather name="heart" size={20} color="#8b5cf6" />
            </View>
            <Text style={styles.cardLabel}>Type</Text>
            <Text style={styles.cardValue}>{petTypeLabel}</Text>
          </View>

          {/* Card 3: Status */}
          <View style={styles.gridCard}>
            <View style={[styles.cardAccent, { backgroundColor: '#f59e0b' }]} />
            <View style={styles.cardIconWrap}>
              <Feather name="star" size={20} color="#f59e0b" />
            </View>
            <Text style={styles.cardLabel}>Status</Text>
            <Text style={styles.cardValue}>{pet ? 'Active' : 'No pet'}</Text>
          </View>

          {/* Card 4: Language */}
          <View style={styles.gridCard}>
            <View style={[styles.cardAccent, { backgroundColor: '#10b981' }]} />
            <View style={styles.cardIconWrap}>
              <Feather name="globe" size={20} color="#10b981" />
            </View>
            <Text style={styles.cardLabel}>Language</Text>
            <View style={styles.languageSelectorWrap}>
              <LanguageSelector />
            </View>
          </View>
        </View>

        {/* Hero Action */}
        {pet ? (
          <TouchableOpacity
            style={[styles.heroCard, { backgroundColor: '#3b82f6' }]}
            onPress={handleContinue}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Continue with your pet"
          >
            <View style={styles.heroContent}>
              <View style={styles.heroTextGroup}>
                <Text style={styles.heroTitle}>Continue Adventure</Text>
                <Text style={styles.heroSubtitle}>Pick up where you left off with {pet.name}</Text>
              </View>
              <Feather name="arrow-right" size={24} color="#ffffff" />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.heroCard, { backgroundColor: '#10b981' }]}
            onPress={handleNewPet}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Create a new pet"
          >
            <View style={styles.heroContent}>
              <View style={styles.heroTextGroup}>
                <Text style={styles.heroTitle}>Create Your Pet</Text>
                <Text style={styles.heroSubtitle}>Start your pet care journey today</Text>
              </View>
              <Feather name="arrow-right" size={24} color="#ffffff" />
            </View>
          </TouchableOpacity>
        )}

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.outlinedButton}
            onPress={handleNewPet}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="New pet"
          >
            <Feather name="plus-circle" size={18} color="#3b82f6" />
            <Text style={styles.outlinedButtonText}>New Pet</Text>
          </TouchableOpacity>

          {pet && (
            <TouchableOpacity
              style={styles.outlinedButtonDanger}
              onPress={handleDeletePet}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Delete pet"
            >
              <Feather name="trash-2" size={18} color="#ef4444" />
              <Text style={styles.outlinedButtonDangerText}>Delete Pet</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <MenuModals {...menu} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    height: 56,
    paddingHorizontal: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },

  // Profile Strip
  profileStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    flexShrink: 1,
  },
  profileEmail: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 1,
  },
  guestBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  guestBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },

  // Scroll
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },

  // Stats Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  gridCard: {
    width: '48%',
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 110,
  },
  cardAccent: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 4,
    borderRadius: 2,
  },
  cardEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  cardIconWrap: {
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  languageSelectorWrap: {
    marginTop: 2,
    marginLeft: -8,
    transform: [{ scale: 0.85 }],
    alignSelf: 'flex-start',
  },

  // Hero Action
  heroCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTextGroup: {
    flex: 1,
    marginRight: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 20,
  },

  // Bottom Actions
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
  },
  outlinedButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#3b82f6',
    backgroundColor: '#ffffff',
  },
  outlinedButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3b82f6',
  },
  outlinedButtonDanger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ef4444',
    backgroundColor: '#ffffff',
  },
  outlinedButtonDangerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ef4444',
  },
});
