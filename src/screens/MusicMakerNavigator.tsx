import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MusicMakerHomeScreen } from './MusicMakerHomeScreen';
import { MusicMakerGameScreen } from './MusicMakerGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const MusicMakerNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="MusicMakerHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="MusicMakerHome" component={MusicMakerHomeScreen} />
    <Stack.Screen name="MusicMakerGame" component={MusicMakerGameScreen} />
  </Stack.Navigator>
);
