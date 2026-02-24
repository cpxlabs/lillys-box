import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ShapeSorterHomeScreen } from './ShapeSorterHomeScreen';
import { ShapeSorterGameScreen } from './ShapeSorterGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const ShapeSorterNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="ShapeSorterHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="ShapeSorterHome" component={ShapeSorterHomeScreen} />
    <Stack.Screen name="ShapeSorterGame" component={ShapeSorterGameScreen} />
  </Stack.Navigator>
);
