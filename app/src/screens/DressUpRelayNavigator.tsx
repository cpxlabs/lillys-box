import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DressUpRelayHomeScreen } from './DressUpRelayHomeScreen';
import { DressUpRelayGameScreen } from './DressUpRelayGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const DressUpRelayNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="DressUpRelayHome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="DressUpRelayHome" component={DressUpRelayHomeScreen} />
      <Stack.Screen name="DressUpRelayGame" component={DressUpRelayGameScreen} />
    </Stack.Navigator>
  );
};
