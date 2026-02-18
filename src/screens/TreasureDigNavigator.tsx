import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TreasureDigHomeScreen } from './TreasureDigHomeScreen';
import { TreasureDigGameScreen } from './TreasureDigGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const TreasureDigNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="TreasureDigHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="TreasureDigHome" component={TreasureDigHomeScreen} />
    <Stack.Screen name="TreasureDigGame" component={TreasureDigGameScreen} />
  </Stack.Navigator>
);
