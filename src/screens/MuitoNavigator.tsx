import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MuitoHomeScreen } from './MuitoHomeScreen';
import { MuitoGameScreen } from './MuitoGameScreen';

const Stack = createNativeStackNavigator();

export const MuitoNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="MuitoHome"
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="MuitoHome" component={MuitoHomeScreen} />
    <Stack.Screen name="MuitoGame" component={MuitoGameScreen} />
  </Stack.Navigator>
);
