import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SoapBubbleShapesHomeScreen } from './SoapBubbleShapesHomeScreen';
import { SoapBubbleShapesGameScreen } from './SoapBubbleShapesGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const SoapBubbleShapesNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="SoapBubbleShapesHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="SoapBubbleShapesHome" component={SoapBubbleShapesHomeScreen} />
    <Stack.Screen name="SoapBubbleShapesGame" component={SoapBubbleShapesGameScreen} />
  </Stack.Navigator>
);
