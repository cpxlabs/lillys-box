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
import { MenuDesign11 } from './menu-designs/MenuDesign11';
import { MenuDesign12 } from './menu-designs/MenuDesign12';
import { MenuDesign13 } from './menu-designs/MenuDesign13';
import { MenuDesign14 } from './menu-designs/MenuDesign14';
import { MenuDesign15 } from './menu-designs/MenuDesign15';
import { MenuDesign16 } from './menu-designs/MenuDesign16';
import { MenuDesign17 } from './menu-designs/MenuDesign17';
import { MenuDesign18 } from './menu-designs/MenuDesign18';
import { MenuDesign19 } from './menu-designs/MenuDesign19';
import { MenuDesign20 } from './menu-designs/MenuDesign20';
import { MenuDesign21 } from './menu-designs/MenuDesign21';
import { MenuDesign22 } from './menu-designs/MenuDesign22';
import { MenuDesign23 } from './menu-designs/MenuDesign23';
import { MenuDesign24 } from './menu-designs/MenuDesign24';
import { MenuDesign25 } from './menu-designs/MenuDesign25';
import { MenuDesign26 } from './menu-designs/MenuDesign26';
import { MenuDesign27 } from './menu-designs/MenuDesign27';
import { MenuDesign28 } from './menu-designs/MenuDesign28';
import { MenuDesign29 } from './menu-designs/MenuDesign29';
import { MenuDesign30 } from './menu-designs/MenuDesign30';

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
      <Stack.Screen name="MenuDesign11" component={MenuDesign11} />
      <Stack.Screen name="MenuDesign12" component={MenuDesign12} />
      <Stack.Screen name="MenuDesign13" component={MenuDesign13} />
      <Stack.Screen name="MenuDesign14" component={MenuDesign14} />
      <Stack.Screen name="MenuDesign15" component={MenuDesign15} />
      <Stack.Screen name="MenuDesign16" component={MenuDesign16} />
      <Stack.Screen name="MenuDesign17" component={MenuDesign17} />
      <Stack.Screen name="MenuDesign18" component={MenuDesign18} />
      <Stack.Screen name="MenuDesign19" component={MenuDesign19} />
      <Stack.Screen name="MenuDesign20" component={MenuDesign20} />
      <Stack.Screen name="MenuDesign21" component={MenuDesign21} />
      <Stack.Screen name="MenuDesign22" component={MenuDesign22} />
      <Stack.Screen name="MenuDesign23" component={MenuDesign23} />
      <Stack.Screen name="MenuDesign24" component={MenuDesign24} />
      <Stack.Screen name="MenuDesign25" component={MenuDesign25} />
      <Stack.Screen name="MenuDesign26" component={MenuDesign26} />
      <Stack.Screen name="MenuDesign27" component={MenuDesign27} />
      <Stack.Screen name="MenuDesign28" component={MenuDesign28} />
      <Stack.Screen name="MenuDesign29" component={MenuDesign29} />
      <Stack.Screen name="MenuDesign30" component={MenuDesign30} />
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
