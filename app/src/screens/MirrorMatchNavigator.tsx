import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MirrorMatchHomeScreen } from './MirrorMatchHomeScreen';
import { MirrorMatchGameScreen } from './MirrorMatchGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const MirrorMatchNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="MirrorMatchHome" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="MirrorMatchHome" component={MirrorMatchHomeScreen} />
    <Stack.Screen name="MirrorMatchGame" component={MirrorMatchGameScreen} />
  </Stack.Navigator>
);
