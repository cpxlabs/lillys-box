import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { usePet } from '../context/PetContext';
import { MenuScreen } from './MenuScreen';
import { CreatePetScreen } from './CreatePetScreen';
import { HomeScreen } from './HomeScreen';
import { FeedScene } from './FeedScene';
import { BathScene } from './BathScene';
import { WardrobeScene } from './WardrobeScene';
import { PlayScene } from './PlayScene';
import { SleepScene } from './SleepScene';
import { VetScene } from './VetScene';

const Stack = createNativeStackNavigator();

export const PetGameNavigator: React.FC = () => {
  const { isLoading } = usePet();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#9b59b6" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="Menu"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="CreatePet" component={CreatePetScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Feed" component={FeedScene} />
      <Stack.Screen name="Bath" component={BathScene} />
      <Stack.Screen name="Wardrobe" component={WardrobeScene} />
      <Stack.Screen name="Play" component={PlayScene} />
      <Stack.Screen name="Sleep" component={SleepScene} />
      <Stack.Screen name="Vet" component={VetScene} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f0ff',
  },
});
