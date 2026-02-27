import React from 'react';
import { GameSelectionScreen } from '../src/screens/GameSelectionScreen';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '../src/types/navigation';

export default function GameSelectionRoute() {
  const navigation = useNavigation<ScreenNavigationProp<'GameSelection'>>();
  return <GameSelectionScreen navigation={navigation} />;
}
