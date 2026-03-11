import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { KidsChessHomeScreen } from './KidsChessHomeScreen';
import { KidsChessGameScreen } from './KidsChessGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const KidsChessNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="KidsChessHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="KidsChessHome" component={KidsChessHomeScreen} />
    <Stack.Screen name="KidsChessGame" component={KidsChessGameScreen} />
  </Stack.Navigator>
);
