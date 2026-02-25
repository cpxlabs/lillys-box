import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ColorMixerHomeScreen } from './ColorMixerHomeScreen';
import { ColorMixerLevelScreen } from './ColorMixerLevelScreen';
import { ColorMixerGameScreen } from './ColorMixerGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const ColorMixerNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="ColorMixerHome"
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="ColorMixerHome" component={ColorMixerHomeScreen} />
    <Stack.Screen name="ColorMixerLevels" component={ColorMixerLevelScreen} />
    <Stack.Screen name="ColorMixerGame" component={ColorMixerGameScreen} />
  </Stack.Navigator>
);
