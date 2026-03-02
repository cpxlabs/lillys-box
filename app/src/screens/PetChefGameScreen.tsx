import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePetChef } from '../context/PetChefContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';

type Props = { navigation: ScreenNavigationProp<'PetChefGame'> };

const RECIPES = [
  {
    name: 'Pet Stew', emoji: '🍲',
    ingredients: ['🥕', '🍖', '🥔', '💧'],
    result: 'A delicious stew!',
    petReaction: '😋',
  },
  {
    name: 'Fish Cake', emoji: '🎂',
    ingredients: ['🐟', '🥚', '🧈', '🌿'],
    result: 'A yummy fish cake!',
    petReaction: '🤩',
  },
  {
    name: 'Veggie Bowl', emoji: '🥗',
    ingredients: ['🥦', '🥕', '🍅', '🌿'],
    result: 'A healthy veggie bowl!',
    petReaction: '😊',
  },
];

export const PetChefGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = usePetChef();
  const [recipeIndex, setRecipeIndex] = useState(0);
  const [added, setAdded] = useState<string[]>([]);
  const [cooked, setCooked] = useState(false);
  const [score, setScore] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [petReaction, setPetReaction] = useState('🐾');

  const recipe = RECIPES[recipeIndex];

  const addIngredient = useCallback((ingredient: string) => {
    const nextNeeded = recipe.ingredients[added.length];
    if (ingredient === nextNeeded) {
      const newAdded = [...added, ingredient];
      setAdded(newAdded);
      if (newAdded.length === recipe.ingredients.length) {
        setCooked(true);
      }
    }
  }, [added, recipe]);

  const serve = useCallback(() => {
    const pts = 100;
    const newScore = score + pts;
    setScore(newScore);
    setPetReaction(recipe.petReaction);
    updateBestScore(newScore);
    setTimeout(() => {
      setPetReaction('🐾');
      const next = recipeIndex + 1;
      if (next >= RECIPES.length) {
        setAllDone(true);
      } else {
        setRecipeIndex(next);
        setAdded([]);
        setCooked(false);
      }
    }, 1200);
  }, [recipe, score, recipeIndex, updateBestScore]);

  const restart = () => { setRecipeIndex(0); setAdded([]); setCooked(false); setScore(0); setAllDone(false); setPetReaction('🐾'); };
  const handleBack = useGameBack(navigation);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
        <Text style={styles.recipeName}>{recipe.emoji} {recipe.name}</Text>
        <Text style={styles.scoreText}>{score} pts</Text>
      </View>

      <View style={styles.kitchen}>
        <View style={styles.pot}>
          <Text style={styles.potEmoji}>{cooked ? recipe.emoji : '🫕'}</Text>
          <View style={styles.potIngredients}>
            {added.map((ing, i) => <Text key={`added-${ing}-${i}`} style={styles.addedIng}>{ing}</Text>)}
          </View>
        </View>
        <Text style={styles.petEmoji}>{petReaction}</Text>
      </View>

      <View style={styles.recipeCard}>
        <Text style={styles.recipeLabel}>{t('petChef.game.recipe')}:</Text>
        <View style={styles.recipeIngredients}>
          {recipe.ingredients.map((ing, i) => (
            <View key={`recipe-${ing}-${i}`} style={[styles.recipeSlot, i < added.length && styles.recipeSlotDone]}>
              <Text style={styles.recipeIngEmoji}>{ing}</Text>
              {i < added.length && <Text style={styles.checkmark}>✓</Text>}
            </View>
          ))}
        </View>
        <Text style={styles.recipeHint}>{t('petChef.game.next')}: {recipe.ingredients[added.length] || '—'}</Text>
      </View>

      <View style={styles.shelf}>
        <Text style={styles.shelfLabel}>{t('petChef.game.ingredients')}:</Text>
        <View style={styles.ingredientRow}>
          {[...new Set(recipe.ingredients)].map((ing, i) => (
            <TouchableOpacity key={ing} style={styles.ingredientBtn} onPress={() => addIngredient(ing)} disabled={cooked}>
              <Text style={styles.ingredientEmoji}>{ing}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {cooked && (
        <TouchableOpacity style={styles.serveBtn} onPress={serve}>
          <Text style={styles.serveBtnText}>{t('petChef.game.serve')} {recipe.emoji}</Text>
        </TouchableOpacity>
      )}

      <Modal visible={allDone} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>👨‍🍳</Text>
            <Text style={styles.modalTitle}>{t('petChef.game.complete')}</Text>
            <Text style={styles.modalScore}>{score} pts</Text>
            <TouchableOpacity style={styles.modalButton} onPress={restart}><Text style={styles.modalButtonText}>{t('petChef.game.playAgain')}</Text></TouchableOpacity>
            <TouchableOpacity style={styles.modalSecondaryButton} onPress={handleBack}><Text style={styles.modalSecondaryText}>{t('common.back')}</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffebee' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#ef9a9a' },
  backText: { fontSize: 16, color: '#b71c1c', fontWeight: '600' },
  recipeName: { fontSize: 16, fontWeight: '700', color: '#b71c1c' },
  scoreText: { fontSize: 16, fontWeight: '700', color: '#b71c1c' },
  kitchen: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', padding: 20 },
  pot: { alignItems: 'center' },
  potEmoji: { fontSize: 72 },
  potIngredients: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 8, justifyContent: 'center' },
  addedIng: { fontSize: 20 },
  petEmoji: { fontSize: 60 },
  recipeCard: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  recipeLabel: { fontSize: 14, fontWeight: '700', color: '#555', marginBottom: 8 },
  recipeIngredients: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  recipeSlot: { width: 52, height: 52, borderRadius: 10, borderWidth: 2, borderColor: '#ef9a9a', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  recipeSlotDone: { backgroundColor: '#e8f5e9', borderColor: '#4caf50', borderStyle: 'solid' },
  recipeIngEmoji: { fontSize: 28 },
  checkmark: { fontSize: 14, color: '#4caf50', position: 'absolute', top: 2, right: 2 },
  recipeHint: { fontSize: 14, color: '#888' },
  shelf: { padding: 16 },
  shelfLabel: { fontSize: 14, fontWeight: '700', color: '#555', marginBottom: 8 },
  ingredientRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  ingredientBtn: { width: 64, height: 64, borderRadius: 16, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  ingredientEmoji: { fontSize: 36 },
  serveBtn: { margin: 16, backgroundColor: '#f44336', borderRadius: 24, paddingVertical: 14, alignItems: 'center' },
  serveBtnText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '80%' },
  modalEmoji: { fontSize: 64, marginBottom: 12 },
  modalTitle: { fontSize: 28, fontWeight: '800', color: '#333', marginBottom: 8 },
  modalScore: { fontSize: 20, color: '#f44336', fontWeight: '700', marginBottom: 24 },
  modalButton: { backgroundColor: '#f44336', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 24, marginBottom: 12, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  modalSecondaryButton: { paddingVertical: 10 },
  modalSecondaryText: { fontSize: 16, color: '#888' },
});
