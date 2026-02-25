import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LightningTapHomeScreen } from './LightningTapHomeScreen';
import { LightningTapGameScreen } from './LightningTapGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const LightningTapNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="LightningTapHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="LightningTapHome" component={LightningTapHomeScreen} />
    <Stack.Screen name="LightningTapGame" component={LightningTapGameScreen} />
  </Stack.Navigator>
);
