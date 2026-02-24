import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PetRunnerHomeScreen } from './PetRunnerHomeScreen';
import { PetRunnerGameScreen } from './PetRunnerGameScreen';

const Stack = createNativeStackNavigator();

export const PetRunnerNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="PetRunnerHome"
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="PetRunnerHome" component={PetRunnerHomeScreen} />
    <Stack.Screen name="PetRunnerGame" component={PetRunnerGameScreen} />
  </Stack.Navigator>
);
