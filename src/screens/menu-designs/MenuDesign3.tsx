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

export const MenuDesign3: React.FC<Props> = ({ navigation }) => {
  const menu = useMenuLogic(navigation);
  const { pet, user, isGuest, t } = menu;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={menu.handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Profile Card */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={menu.handleSignOut}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
        >
          <View style={styles.profileLeft}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarInner}>
                <Text style={styles.avatarText}>
                  {isGuest ? '?' : (user?.email?.[0]?.toUpperCase() ?? '?')}
                </Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName} numberOfLines={1}>
                {isGuest ? t('menu.guest') : (user?.email ?? '')}
              </Text>
              <Text style={styles.profileSubtext}>
                {isGuest ? t('menu.guestLabel') : t('menu.signedIn')}
              </Text>
            </View>
          </View>
          <Feather name="log-out" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Pet Care <Text style={styles.titleEmoji}>🐾</Text></Text>
          <Text style={styles.subtitle}>{t('menu.subtitle')}</Text>
        </View>

        {/* Hero Card */}
        {pet ? (
          <TouchableOpacity
            style={styles.heroCardPet}
            onPress={menu.handleContinue}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={t('menu.continuePlaying')}
          >
            {/* Simulated gradient overlay layers */}
            <View style={styles.heroOverlayTop} />
            <View style={styles.heroOverlayBottom} />
            <View style={styles.heroContent}>
              <Text style={styles.heroEmoji}>
                {pet.type === 'cat' ? '🐱' : pet.type === 'dog' ? '🐶' : '🐰'}
              </Text>
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroTitle}>{pet.name}</Text>
                <Text style={styles.heroDescription}>{t('menu.continuePlaying')}</Text>
              </View>
              <Feather name="chevron-right" size={28} color="#fff" />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.heroCardNew}
            onPress={menu.handleNewPet}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={t('menu.createPet')}
          >
            {/* Simulated gradient overlay layers */}
            <View style={styles.heroNewOverlayTop} />
            <View style={styles.heroNewOverlayBottom} />
            <View style={styles.heroContent}>
              <Text style={styles.heroEmoji}>🥚</Text>
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroTitle}>{t('menu.createPet')}</Text>
                <Text style={styles.heroDescription}>{t('menu.createPetHint')}</Text>
              </View>
              <Feather name="chevron-right" size={28} color="#fff" />
            </View>
          </TouchableOpacity>
        )}

        {/* Action Row */}
        <View style={styles.actionRow}>
          {/* Language Card */}
          <View style={styles.languageCard}>
            <View style={styles.languageHeader}>
              <Feather name="globe" size={18} color="#fff" />
              <Text style={styles.languageLabel}>{t('menu.language')}</Text>
            </View>
            <LanguageSelector />
          </View>

          {/* Right Column: New Pet + Delete */}
          <View style={styles.actionRightColumn}>
            {/* New Pet Button */}
            <TouchableOpacity
              style={styles.newPetButton}
              onPress={menu.handleNewPet}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={t('menu.newPet')}
            >
              <Feather name="plus-circle" size={20} color="#2d3436" />
              <Text style={styles.newPetText}>{t('menu.newPet')}</Text>
            </TouchableOpacity>

            {/* Delete Pet Button */}
            {pet && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={menu.handleDeletePet}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={t('menu.deletePet')}
              >
                <Feather name="trash-2" size={18} color="#fff" />
                <Text style={styles.deleteText}>{t('menu.deletePet')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      <MenuModals {...menu} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Back Button
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  // Profile Card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#6c5ce7',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#a29bfe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6c5ce7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  profileSubtext: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },

  // Title
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },
  titleEmoji: {
    fontSize: 32,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
    marginTop: 6,
  },

  // Hero Card (existing pet)
  heroCardPet: {
    backgroundColor: '#e84393',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#e84393',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 10,
  },
  heroOverlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: '40%' as any,
    bottom: 0,
    backgroundColor: 'rgba(253, 121, 168, 0.4)',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  heroOverlayBottom: {
    position: 'absolute',
    top: 0,
    left: '60%' as any,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(214, 48, 49, 0.25)',
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },

  // Hero Card (new pet)
  heroCardNew: {
    backgroundColor: '#0984e3',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#0984e3',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 10,
  },
  heroNewOverlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: '40%' as any,
    bottom: 0,
    backgroundColor: 'rgba(116, 185, 255, 0.4)',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  heroNewOverlayBottom: {
    position: 'absolute',
    top: 0,
    left: '60%' as any,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(9, 132, 227, 0.3)',
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },

  // Hero shared
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 56,
    marginRight: 16,
  },
  heroTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  heroDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },

  // Action Row
  actionRow: {
    flexDirection: 'row',
    gap: 16,
  },

  // Language Card
  languageCard: {
    flex: 1,
    backgroundColor: '#00b894',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#00b894',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  languageLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 8,
  },

  // Right Column
  actionRightColumn: {
    flex: 1,
    gap: 16,
  },

  // New Pet Button
  newPetButton: {
    backgroundColor: '#fdcb6e',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#fdcb6e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  newPetText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2d3436',
  },

  // Delete Button
  deleteButton: {
    backgroundColor: '#d63031',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#d63031',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  deleteText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
