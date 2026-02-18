import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BubblePopHomeScreen } from './BubblePopHomeScreen';
import { BubblePopGameScreen } from './BubblePopGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const BubblePopNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="BubblePopHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="BubblePopHome" component={BubblePopHomeScreen} />
    <Stack.Screen name="BubblePopGame" component={BubblePopGameScreen} />
  </Stack.Navigator>
);
