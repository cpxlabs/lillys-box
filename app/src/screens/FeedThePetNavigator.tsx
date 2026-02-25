import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FeedThePetHomeScreen } from './FeedThePetHomeScreen';
import { FeedThePetGameScreen } from './FeedThePetGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const FeedThePetNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="FeedThePetHome"
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="FeedThePetHome" component={FeedThePetHomeScreen} />
    <Stack.Screen name="FeedThePetGame" component={FeedThePetGameScreen} />
  </Stack.Navigator>
);
