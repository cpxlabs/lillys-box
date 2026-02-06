import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { usePet } from '../context/PetContext';
import { MenuScreen } from './MenuScreen';
import { CreatePetScreen } from './CreatePetScreen';
import { HomeScreen } from './HomeScreen';
import { FeedScene } from './FeedScene';
import { BathScene } from './BathScene';
import { WardrobeScene } from './WardrobeScene';
import { PlayScene } from './PlayScene';
import { SleepScene } from './SleepScene';
import { VetScene } from './VetScene';
import { MenuDesignPicker } from './menu-designs/MenuDesignPicker';
import { MenuDesign1 } from './menu-designs/MenuDesign1';
import { MenuDesign2 } from './menu-designs/MenuDesign2';
import { MenuDesign3 } from './menu-designs/MenuDesign3';
import { MenuDesign4 } from './menu-designs/MenuDesign4';
import { MenuDesign5 } from './menu-designs/MenuDesign5';
import { MenuDesign6 } from './menu-designs/MenuDesign6';
import { MenuDesign7 } from './menu-designs/MenuDesign7';
import { MenuDesign8 } from './menu-designs/MenuDesign8';
import { MenuDesign9 } from './menu-designs/MenuDesign9';
import { MenuDesign10 } from './menu-designs/MenuDesign10';

const Stack = createNativeStackNavigator();

export const PetGameNavigator: React.FC = () => {
  const { isLoading } = usePet();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#9b59b6" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="MenuDesignPicker"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MenuDesignPicker" component={MenuDesignPicker} />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="MenuDesign1" component={MenuDesign1} />
      <Stack.Screen name="MenuDesign2" component={MenuDesign2} />
      <Stack.Screen name="MenuDesign3" component={MenuDesign3} />
      <Stack.Screen name="MenuDesign4" component={MenuDesign4} />
      <Stack.Screen name="MenuDesign5" component={MenuDesign5} />
      <Stack.Screen name="MenuDesign6" component={MenuDesign6} />
      <Stack.Screen name="MenuDesign7" component={MenuDesign7} />
      <Stack.Screen name="MenuDesign8" component={MenuDesign8} />
      <Stack.Screen name="MenuDesign9" component={MenuDesign9} />
      <Stack.Screen name="MenuDesign10" component={MenuDesign10} />
      <Stack.Screen name="CreatePet" component={CreatePetScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Feed" component={FeedScene} />
      <Stack.Screen name="Bath" component={BathScene} />
      <Stack.Screen name="Wardrobe" component={WardrobeScene} />
      <Stack.Screen name="Play" component={PlayScene} />
      <Stack.Screen name="Sleep" component={SleepScene} />
      <Stack.Screen name="Vet" component={VetScene} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f0ff',
  },
});
