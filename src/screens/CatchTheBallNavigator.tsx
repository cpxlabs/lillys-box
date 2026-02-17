import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CatchTheBallHomeScreen } from './CatchTheBallHomeScreen';
import { CatchTheBallGameScreen } from './CatchTheBallGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const CatchTheBallNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="CatchTheBallHome"
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="CatchTheBallHome" component={CatchTheBallHomeScreen} />
    <Stack.Screen name="CatchTheBallGame" component={CatchTheBallGameScreen} />
  </Stack.Navigator>
);
