import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

type DesignOption = {
  id: number;
  name: string;
  description: string;
  accent: string;
  screen: string;
};

const DESIGN_OPTIONS: DesignOption[] = [
  {
    id: 1,
    name: 'Glassmorphism',
    description: 'Frosted glass cards, translucent layers',
    accent: '#667eea',
    screen: 'MenuDesign1',
  },
  {
    id: 2,
    name: 'Neomorphism',
    description: 'Soft shadows, raised elements',
    accent: '#a0aec0',
    screen: 'MenuDesign2',
  },
  {
    id: 3,
    name: 'Vibrant Gradients',
    description: 'Bold gradient cards, rich colors',
    accent: '#f093fb',
    screen: 'MenuDesign3',
  },
  {
    id: 4,
    name: 'Minimal Clean',
    description: 'Maximum whitespace, thin lines',
    accent: '#2d3436',
    screen: 'MenuDesign4',
  },
  {
    id: 5,
    name: 'Dark Mode Neon',
    description: 'Dark background, neon accents',
    accent: '#00f5d4',
    screen: 'MenuDesign5',
  },
  {
    id: 6,
    name: 'Playful Bubbly',
    description: 'Rounded shapes, bright pastels',
    accent: '#ff6b6b',
    screen: 'MenuDesign6',
  },
  {
    id: 7,
    name: 'Card Stack',
    description: 'Layered overlapping cards, depth',
    accent: '#ffa726',
    screen: 'MenuDesign7',
  },
  {
    id: 8,
    name: 'Dashboard',
    description: 'Stats grid, sidebar layout',
    accent: '#42a5f5',
    screen: 'MenuDesign8',
  },
  {
    id: 9,
    name: 'Retro Pixel',
    description: '8-bit aesthetic, sharp edges',
    accent: '#ffeb3b',
    screen: 'MenuDesign9',
  },
  {
    id: 10,
    name: 'Nature Garden',
    description: 'Earthy greens, organic shapes',
    accent: '#66bb6a',
    screen: 'MenuDesign10',
  },
];

type Props = {
  navigation: any;
};

export const MenuDesignPicker: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Feather name="chevron-left" size={24} color="#7c3aed" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Menu Design Options</Text>
          <Text style={styles.subtitle}>Pick your favorite</Text>
        </View>

        {/* Design Cards */}
        <View style={styles.cardList}>
          {DESIGN_OPTIONS.map((design) => (
            <TouchableOpacity
              key={design.id}
              style={[styles.card, { borderLeftColor: design.accent }]}
              onPress={() => navigation.navigate(design.screen)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`${design.name}: ${design.description}`}
            >
              <View
                style={[styles.numberBadge, { backgroundColor: design.accent }]}
              >
                <Text style={styles.numberText}>{design.id}</Text>
              </View>

              <View style={styles.textArea}>
                <Text style={styles.designName}>{design.name}</Text>
                <Text style={styles.designDescription}>
                  {design.description}
                </Text>
              </View>

              <Feather name="chevron-right" size={20} color="#c0c0c0" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#7c3aed',
    fontWeight: '600',
    marginLeft: 4,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  cardList: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  numberText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  textArea: {
    flex: 1,
    marginRight: 8,
  },
  designName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 3,
  },
  designDescription: {
    fontSize: 13,
    color: '#888',
    fontWeight: '400',
  },
});
