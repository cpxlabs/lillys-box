import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ColorTapHomeScreen } from './ColorTapHomeScreen';
import { ColorTapGameScreen } from './ColorTapGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const ColorTapNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="ColorTapHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="ColorTapHome" component={ColorTapHomeScreen} />
    <Stack.Screen name="ColorTapGame" component={ColorTapGameScreen} />
  </Stack.Navigator>
);
