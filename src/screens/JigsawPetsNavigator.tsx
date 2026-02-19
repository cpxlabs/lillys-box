import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { JigsawPetsHomeScreen } from './JigsawPetsHomeScreen';
import { JigsawPetsGameScreen } from './JigsawPetsGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const JigsawPetsNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="JigsawPetsHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="JigsawPetsHome" component={JigsawPetsHomeScreen} />
    <Stack.Screen name="JigsawPetsGame" component={JigsawPetsGameScreen} />
  </Stack.Navigator>
);
