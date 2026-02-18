import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PhotoStudioHomeScreen } from './PhotoStudioHomeScreen';
import { PhotoStudioGameScreen } from './PhotoStudioGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const PhotoStudioNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="PhotoStudioHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="PhotoStudioHome" component={PhotoStudioHomeScreen} />
    <Stack.Screen name="PhotoStudioGame" component={PhotoStudioGameScreen} />
  </Stack.Navigator>
);
