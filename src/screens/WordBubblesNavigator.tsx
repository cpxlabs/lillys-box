import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WordBubblesHomeScreen } from './WordBubblesHomeScreen';
import { WordBubblesGameScreen } from './WordBubblesGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const WordBubblesNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="WordBubblesHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="WordBubblesHome" component={WordBubblesHomeScreen} />
    <Stack.Screen name="WordBubblesGame" component={WordBubblesGameScreen} />
  </Stack.Navigator>
);
