import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BalloonFloatHomeScreen } from './BalloonFloatHomeScreen';
import { BalloonFloatGameScreen } from './BalloonFloatGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const BalloonFloatNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="BalloonFloatHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="BalloonFloatHome" component={BalloonFloatHomeScreen} />
    <Stack.Screen name="BalloonFloatGame" component={BalloonFloatGameScreen} />
  </Stack.Navigator>
);
