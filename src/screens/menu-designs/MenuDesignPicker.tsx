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
  {
    id: 11,
    name: 'Candy Land',
    description: 'Doces, cores de chiclete, emojis de candy',
    accent: '#ff69b4',
    screen: 'MenuDesign11',
  },
  {
    id: 12,
    name: 'Ocean Adventure',
    description: 'Fundo do mar, peixes, bolhas, coral',
    accent: '#0077b6',
    screen: 'MenuDesign12',
  },
  {
    id: 13,
    name: 'Space Pets',
    description: 'Galáxia, estrelas, foguetes, planetas',
    accent: '#5b2c8e',
    screen: 'MenuDesign13',
  },
  {
    id: 14,
    name: 'Rainbow Joy',
    description: 'Arco-íris completo, cores vibrantes',
    accent: '#ff6b6b',
    screen: 'MenuDesign14',
  },
  {
    id: 15,
    name: 'Jungle Safari',
    description: 'Selva tropical, animais, folhas',
    accent: '#2d6a4f',
    screen: 'MenuDesign15',
  },
  {
    id: 16,
    name: 'Fairy Tale',
    description: 'Conto de fadas, castelo, magia, unicórnio',
    accent: '#7c3aed',
    screen: 'MenuDesign16',
  },
  {
    id: 17,
    name: 'Toy Box',
    description: 'Blocos de montar, brinquedos, cores primárias',
    accent: '#e63946',
    screen: 'MenuDesign17',
  },
  {
    id: 18,
    name: 'Ice Cream Party',
    description: 'Sorvetes, granulados, cores doces',
    accent: '#ff6b8a',
    screen: 'MenuDesign18',
  },
  {
    id: 19,
    name: 'Dino World',
    description: 'Dinossauros, pré-história, vulcões',
    accent: '#4caf50',
    screen: 'MenuDesign19',
  },
  {
    id: 20,
    name: 'Circus Fun',
    description: 'Circo, balões, show, cores vibrantes',
    accent: '#dc2626',
    screen: 'MenuDesign20',
  },
  {
    id: 21,
    name: 'Soft Clouds',
    description: 'Nuvens suaves, azul celeste, acolhedor',
    accent: '#7ec8e3',
    screen: 'MenuDesign21',
  },
  {
    id: 22,
    name: 'Watercolor',
    description: 'Aquarela, tons pastel, pinceladas suaves',
    accent: '#c97b5a',
    screen: 'MenuDesign22',
  },
  {
    id: 23,
    name: 'Geometric Fun',
    description: 'Formas geom\u00e9tricas coloridas, c\u00edrculos e quadrados',
    accent: '#6c5ce7',
    screen: 'MenuDesign23',
  },
  {
    id: 24,
    name: 'Chalk Board',
    description: 'Lousa verde, giz colorido, escola',
    accent: '#2d4a3e',
    screen: 'MenuDesign24',
  },
  {
    id: 25,
    name: 'Paper Craft',
    description: 'Papel kraft, recortes, camadas de papel',
    accent: '#e05252',
    screen: 'MenuDesign25',
  },
  {
    id: 26,
    name: 'Storybook',
    description: 'Livro de hist\u00f3rias, molduras douradas, cl\u00e1ssico',
    accent: '#2c3e6b',
    screen: 'MenuDesign26',
  },
  {
    id: 27,
    name: 'Bubble Pop',
    description: 'Bolhas de sab\u00e3o, c\u00edrculos flutuantes, menta',
    accent: '#a29bfe',
    screen: 'MenuDesign27',
  },
  {
    id: 28,
    name: 'Crayon Box',
    description: 'Giz de cera, cores vivas, tra\u00e7os grossos',
    accent: '#3498db',
    screen: 'MenuDesign28',
  },
  {
    id: 29,
    name: 'Animal Paws',
    description: 'Patinhas, tons terrosos, tema pet',
    accent: '#8B6F47',
    screen: 'MenuDesign29',
  },
  {
    id: 30,
    name: 'Playground',
    description: 'Parquinho, cerca de madeira, grama verde',
    accent: '#42a5f5',
    screen: 'MenuDesign30',
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
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Menu Design Options</Text>
          <Text style={styles.subtitle}>Pick your favorite</Text>
        </View>

        {/* Design Cards */}
        <View style={styles.cardList}>
          {DESIGN_OPTIONS.map((design) => (
            <React.Fragment key={design.id}>
              {design.id === 11 && (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionEmoji}>🎨🧸🌈</Text>
                  <Text style={styles.sectionTitle}>Infantil & Colorido</Text>
                  <Text style={styles.sectionSubtitle}>Temas focados no jogo pet care</Text>
                </View>
              )}
              {design.id === 21 && (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Unissex & Sem Emojis</Text>
                  <Text style={styles.sectionSubtitle}>Infantil, clean, com formas decorativas</Text>
                </View>
              )}
              <TouchableOpacity
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
            </React.Fragment>
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
  sectionHeader: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
    paddingVertical: 12,
  },
  sectionEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#e91e63',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
});
