import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal, DimensionValue } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useWeatherWizard } from '../context/WeatherWizardContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = { navigation: ScreenNavigationProp<'WeatherWizardGame'> };

type Weather = 'rain' | 'sun' | 'snow' | 'wind';

interface Scene {
  name: string;
  description: string;
  emoji: string;
  steps: Array<{ need: Weather; result: string; emoji: string }>;
}

const SCENES: Scene[] = [
  {
    name: 'The Dry Garden', emoji: '🏜️',
    description: 'Help the garden bloom!',
    steps: [
      { need: 'rain', result: 'The flower starts growing!', emoji: '🌱' },
      { need: 'sun', result: 'The flower is blooming!', emoji: '🌸' },
    ],
  },
  {
    name: 'The Boat', emoji: '⛵',
    description: 'Help the boat reach shore!',
    steps: [
      { need: 'wind', result: 'The boat starts moving!', emoji: '⛵💨' },
      { need: 'sun', result: 'The boat arrives safely!', emoji: '🏝️' },
    ],
  },
  {
    name: 'The Puddle', emoji: '💧',
    description: 'Help the frog cross!',
    steps: [
      { need: 'sun', result: 'The puddle is drying!', emoji: '🌤️' },
      { need: 'wind', result: 'The frog hops across!', emoji: '🐸💨' },
    ],
  },
  {
    name: 'The Snowman', emoji: '☃️',
    description: 'Build a snowman!',
    steps: [
      { need: 'snow', result: 'Snow is falling!', emoji: '❄️' },
      { need: 'snow', result: 'The snowman is built!', emoji: '⛄' },
    ],
  },
];

const WEATHER_ICONS: Record<Weather, string> = { rain: '🌧️', sun: '☀️', snow: '❄️', wind: '💨' };

export const WeatherWizardGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useWeatherWizard();
  const { triggerAd } = useGameAdTrigger('weather-wizard');
  const [adRewardPending, setAdRewardPending] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepResult, setStepResult] = useState('');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState('');

  const scene = SCENES[sceneIndex];
  const currentStep = scene.steps[stepIndex];

  const applyWeather = useCallback((weather: Weather) => {
    if (weather === currentStep.need) {
      setStepResult(currentStep.result);
      setFeedback('✨ Magic!');
      const pts = 50;
      const newScore = score + pts;
      setScore(newScore);
      setTimeout(() => {
        setFeedback('');
        const nextStep = stepIndex + 1;
        if (nextStep >= scene.steps.length) {
          const nextScene = sceneIndex + 1;
          if (nextScene >= SCENES.length) {
            updateBestScore(newScore);
            setGameOver(true);
          } else {
            setSceneIndex(nextScene);
            setStepIndex(0);
            setStepResult('');
          }
        } else {
          setStepIndex(nextStep);
        }
      }, 1000);
    } else {
      setFeedback('❌ Try different weather!');
      setTimeout(() => setFeedback(''), 800);
    }
  }, [currentStep, stepIndex, scene, sceneIndex, score, updateBestScore]);

  const restart = () => { setSceneIndex(0); setStepIndex(0); setStepResult(''); setScore(0); setGameOver(false); setFeedback(''); };
  const handleBack = useGameBack(navigation);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
        <Text style={styles.sceneText}>{scene.name}</Text>
        <Text style={styles.scoreText}>⭐ {score}</Text>
      </View>

      <View style={styles.sceneArea}>
        <Text style={styles.sceneEmoji}>{stepResult ? currentStep.emoji : scene.emoji}</Text>
        <Text style={styles.sceneDescription}>{scene.description}</Text>
        <Text style={styles.stepHint}>{t('weatherWizard.game.need')}: {WEATHER_ICONS[currentStep.need]} {currentStep.need}</Text>
        {stepResult ? <Text style={styles.stepResult}>{stepResult}</Text> : null}
        {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
      </View>

      <View style={styles.petArea}>
        <Text style={styles.petEmoji}>🧙‍♂️🐾</Text>
      </View>

      <View style={styles.weatherToolbar}>
        <Text style={styles.toolbarLabel}>{t('weatherWizard.game.choose')}:</Text>
        <View style={styles.weatherButtons}>
          {(['rain', 'sun', 'snow', 'wind'] as Weather[]).map(w => (
            <TouchableOpacity key={w} style={styles.weatherBtn} onPress={() => applyWeather(w)}>
              <Text style={styles.weatherEmoji}>{WEATHER_ICONS[w]}</Text>
              <Text style={styles.weatherName}>{w}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.progress}>
        <Text style={styles.progressText}>{t('weatherWizard.game.scene')} {sceneIndex + 1}/{SCENES.length}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((sceneIndex + stepIndex / scene.steps.length) / SCENES.length) * 100}%` as DimensionValue }]} />
        </View>
      </View>

      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🌈</Text>
            <Text style={styles.modalTitle}>{t('weatherWizard.game.complete')}</Text>
            <Text style={styles.modalScore}>{score} pts</Text>
            
            {!adRewardPending && (
              <>
                <TouchableOpacity 
                  style={styles.modalButton} 
                  onPress={async () => {
                    setAdRewardPending(true);
                    const reward = await triggerAd('game_ended', score);
                    if (reward > 0) {
                      const newScore = score + reward;
                      updateBestScore(newScore);
                    }
                    setAdRewardPending(false);
                  }}
                  disabled={adRewardPending}
                >
                  <Text style={styles.modalButtonText}>🎬 Watch Ad to Double!</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.modalButton} onPress={restart}><Text style={styles.modalButtonText}>{t('weatherWizard.game.playAgain')}</Text></TouchableOpacity>
              </>
            )}
            
            <TouchableOpacity style={styles.modalSecondaryButton} onPress={handleBack}><Text style={styles.modalSecondaryText}>{t('common.back')}</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e0f7fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#80cbc4' },
  backText: { fontSize: 16, color: '#004d40', fontWeight: '600' },
  sceneText: { fontSize: 16, fontWeight: '700', color: '#004d40' },
  scoreText: { fontSize: 16, fontWeight: '700', color: '#004d40' },
  sceneArea: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  sceneEmoji: { fontSize: 100, marginBottom: 16 },
  sceneDescription: { fontSize: 18, color: '#333', textAlign: 'center', marginBottom: 12 },
  stepHint: { fontSize: 16, color: '#00796b', fontWeight: '700', marginBottom: 8 },
  stepResult: { fontSize: 16, color: '#2e7d32', fontWeight: '700', textAlign: 'center' },
  feedback: { fontSize: 20, fontWeight: '800', color: '#ff7043', marginTop: 8 },
  petArea: { alignItems: 'center', paddingVertical: 8 },
  petEmoji: { fontSize: 40 },
  weatherToolbar: { backgroundColor: 'rgba(0,0,0,0.1)', padding: 16 },
  toolbarLabel: { fontSize: 14, color: '#004d40', fontWeight: '600', marginBottom: 8 },
  weatherButtons: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  weatherBtn: { backgroundColor: '#fff', borderRadius: 16, padding: 12, alignItems: 'center', flex: 1 },
  weatherEmoji: { fontSize: 32 },
  weatherName: { fontSize: 12, color: '#555', fontWeight: '600', textTransform: 'capitalize' },
  progress: { padding: 16 },
  progressText: { fontSize: 14, color: '#555', marginBottom: 6 },
  progressBar: { height: 6, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 3 },
  progressFill: { height: '100%', backgroundColor: '#00796b', borderRadius: 3 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '80%' },
  modalEmoji: { fontSize: 64, marginBottom: 12 },
  modalTitle: { fontSize: 28, fontWeight: '800', color: '#333', marginBottom: 8 },
  modalScore: { fontSize: 20, color: '#00796b', fontWeight: '700', marginBottom: 24 },
  modalButton: { backgroundColor: '#00796b', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 24, marginBottom: 12, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  modalSecondaryButton: { paddingVertical: 10 },
  modalSecondaryText: { fontSize: 16, color: '#888' },
});
