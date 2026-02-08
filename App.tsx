import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import './src/i18n'; // Initialize i18n
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { LanguageProvider } from './src/context/LanguageContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ToastProvider } from './src/context/ToastContext';
import { AdProvider, useAd } from './src/context/AdContext';
import AdService from './src/services/AdService';
import { LoginScreen } from './src/screens/LoginScreen';
import { GameSelectionScreen } from './src/screens/GameSelectionScreen';
import { GameContainer } from './src/screens/GameContainer';
import { gameRegistry } from './src/registry/GameRegistry';
import { PetProvider } from './src/context/PetContext';
import { PetGameNavigator } from './src/screens/PetGameNavigator';
import { MuitoProvider } from './src/context/MuitoContext';
import { MuitoNavigator } from './src/screens/MuitoNavigator';
import { MenuDesignPicker } from './src/screens/menu-designs/MenuDesignPicker';
import { MenuDesign1 } from './src/screens/menu-designs/MenuDesign1';
import { MenuDesign2 } from './src/screens/menu-designs/MenuDesign2';
import { MenuDesign3 } from './src/screens/menu-designs/MenuDesign3';
import { MenuDesign4 } from './src/screens/menu-designs/MenuDesign4';
import { MenuDesign5 } from './src/screens/menu-designs/MenuDesign5';
import { MenuDesign6 } from './src/screens/menu-designs/MenuDesign6';
import { MenuDesign7 } from './src/screens/menu-designs/MenuDesign7';
import { MenuDesign8 } from './src/screens/menu-designs/MenuDesign8';
import { MenuDesign9 } from './src/screens/menu-designs/MenuDesign9';
import { MenuDesign10 } from './src/screens/menu-designs/MenuDesign10';
import { MenuDesign11 } from './src/screens/menu-designs/MenuDesign11';
import { MenuDesign12 } from './src/screens/menu-designs/MenuDesign12';
import { MenuDesign13 } from './src/screens/menu-designs/MenuDesign13';
import { MenuDesign14 } from './src/screens/menu-designs/MenuDesign14';
import { MenuDesign15 } from './src/screens/menu-designs/MenuDesign15';
import { MenuDesign16 } from './src/screens/menu-designs/MenuDesign16';
import { MenuDesign17 } from './src/screens/menu-designs/MenuDesign17';
import { MenuDesign18 } from './src/screens/menu-designs/MenuDesign18';
import { MenuDesign19 } from './src/screens/menu-designs/MenuDesign19';
import { MenuDesign20 } from './src/screens/menu-designs/MenuDesign20';
import { MenuDesign21 } from './src/screens/menu-designs/MenuDesign21';
import { MenuDesign22 } from './src/screens/menu-designs/MenuDesign22';
import { MenuDesign23 } from './src/screens/menu-designs/MenuDesign23';
import { MenuDesign24 } from './src/screens/menu-designs/MenuDesign24';
import { MenuDesign25 } from './src/screens/menu-designs/MenuDesign25';
import { MenuDesign26 } from './src/screens/menu-designs/MenuDesign26';
import { MenuDesign27 } from './src/screens/menu-designs/MenuDesign27';
import { MenuDesign28 } from './src/screens/menu-designs/MenuDesign28';
import { MenuDesign29 } from './src/screens/menu-designs/MenuDesign29';
import { MenuDesign30 } from './src/screens/menu-designs/MenuDesign30';

// Register the pet-care game
gameRegistry.register({
  id: 'pet-care',
  nameKey: 'selectGame.petCare.name',
  descriptionKey: 'selectGame.petCare.description',
  emoji: '🐾',
  category: 'pet',
  navigator: PetGameNavigator,
  providers: [PetProvider],
  isEnabled: true,
});

// Register the muito counting game
gameRegistry.register({
  id: 'muito',
  nameKey: 'selectGame.muito.name',
  descriptionKey: 'selectGame.muito.description',
  emoji: '🔢',
  category: 'casual',
  navigator: MuitoNavigator,
  providers: [MuitoProvider],
  isEnabled: true,
});

const Stack = createNativeStackNavigator();
const DesignStack = createNativeStackNavigator();

// Temporary preview mode: set to true to directly access design options
const DESIGN_PREVIEW_MODE = true;

const DesignPreviewNavigator: React.FC = () => (
  <PetProvider>
    <DesignStack.Navigator
      initialRouteName="MenuDesignPicker"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <DesignStack.Screen name="MenuDesignPicker" component={MenuDesignPicker} />
      <DesignStack.Screen name="MenuDesign1" component={MenuDesign1} />
      <DesignStack.Screen name="MenuDesign2" component={MenuDesign2} />
      <DesignStack.Screen name="MenuDesign3" component={MenuDesign3} />
      <DesignStack.Screen name="MenuDesign4" component={MenuDesign4} />
      <DesignStack.Screen name="MenuDesign5" component={MenuDesign5} />
      <DesignStack.Screen name="MenuDesign6" component={MenuDesign6} />
      <DesignStack.Screen name="MenuDesign7" component={MenuDesign7} />
      <DesignStack.Screen name="MenuDesign8" component={MenuDesign8} />
      <DesignStack.Screen name="MenuDesign9" component={MenuDesign9} />
      <DesignStack.Screen name="MenuDesign10" component={MenuDesign10} />
      <DesignStack.Screen name="MenuDesign11" component={MenuDesign11} />
      <DesignStack.Screen name="MenuDesign12" component={MenuDesign12} />
      <DesignStack.Screen name="MenuDesign13" component={MenuDesign13} />
      <DesignStack.Screen name="MenuDesign14" component={MenuDesign14} />
      <DesignStack.Screen name="MenuDesign15" component={MenuDesign15} />
      <DesignStack.Screen name="MenuDesign16" component={MenuDesign16} />
      <DesignStack.Screen name="MenuDesign17" component={MenuDesign17} />
      <DesignStack.Screen name="MenuDesign18" component={MenuDesign18} />
      <DesignStack.Screen name="MenuDesign19" component={MenuDesign19} />
      <DesignStack.Screen name="MenuDesign20" component={MenuDesign20} />
      <DesignStack.Screen name="MenuDesign21" component={MenuDesign21} />
      <DesignStack.Screen name="MenuDesign22" component={MenuDesign22} />
      <DesignStack.Screen name="MenuDesign23" component={MenuDesign23} />
      <DesignStack.Screen name="MenuDesign24" component={MenuDesign24} />
      <DesignStack.Screen name="MenuDesign25" component={MenuDesign25} />
      <DesignStack.Screen name="MenuDesign26" component={MenuDesign26} />
      <DesignStack.Screen name="MenuDesign27" component={MenuDesign27} />
      <DesignStack.Screen name="MenuDesign28" component={MenuDesign28} />
      <DesignStack.Screen name="MenuDesign29" component={MenuDesign29} />
      <DesignStack.Screen name="MenuDesign30" component={MenuDesign30} />
    </DesignStack.Navigator>
  </PetProvider>
);

const AppNavigator: React.FC = () => {
  const { user, isGuest, loading: authLoading } = useAuth();
  const { incrementScreenCount, shouldShowInterstitial, showInterstitialAd } = useAd();

  if (authLoading && !DESIGN_PREVIEW_MODE) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#9b59b6" />
      </View>
    );
  }

  const isAuthenticated = user !== null || isGuest;

  // Design preview mode: skip auth, go straight to design picker
  if (DESIGN_PREVIEW_MODE) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="DesignPreview"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="DesignPreview" component={DesignPreviewNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer
      onStateChange={() => {
        if (isAuthenticated) {
          incrementScreenCount();

          if (shouldShowInterstitial()) {
            showInterstitialAd();
          }
        }
      }}
    >
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'GameSelection' : 'Login'}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="GameSelection" component={GameSelectionScreen} />
            <Stack.Screen name="GameContainer" component={GameContainer} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  useEffect(() => {
    // Initialize AdMob on app startup
    AdService.initializeAds();
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LanguageProvider>
          <AuthProvider>
            <AdProvider>
              <ToastProvider>
                <AppNavigator />
              </ToastProvider>
            </AdProvider>
          </AuthProvider>
        </LanguageProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f0ff',
  },
});