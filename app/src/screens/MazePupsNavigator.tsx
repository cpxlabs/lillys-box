import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { MazePupsHomeScreen } from './MazePupsHomeScreen';
import { MazePupsGameScreen } from './MazePupsGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const MazePupsNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="MazePupsHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="MazePupsHome" component={MazePupsHomeScreen} />
    <Stack.Screen name="MazePupsGame" component={MazePupsGameScreen} />
  </Stack.Navigator>
);
