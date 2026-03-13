import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { PatternPawsHomeScreen } from './PatternPawsHomeScreen';
import { PatternPawsGameScreen } from './PatternPawsGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const PatternPawsNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="PatternPawsHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="PatternPawsHome" component={PatternPawsHomeScreen} />
    <Stack.Screen name="PatternPawsGame" component={PatternPawsGameScreen} />
  </Stack.Navigator>
);
