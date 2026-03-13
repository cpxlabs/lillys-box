import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { KidsLudoHomeScreen } from './KidsLudoHomeScreen';
import { KidsLudoGameScreen } from './KidsLudoGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const KidsLudoNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="KidsLudoHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="KidsLudoHome" component={KidsLudoHomeScreen} />
    <Stack.Screen name="KidsLudoGame" component={KidsLudoGameScreen} />
  </Stack.Navigator>
);
