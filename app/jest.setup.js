// Minimal mocks for testing utilities

// Mock @react-native/js-polyfills to avoid Flow syntax errors
jest.mock('@react-native/js-polyfills/error-guard', () => ({}));

// Mock React Native completely to avoid Flow syntax errors  
// We don't use jest.requireActual because react-native contains Flow syntax
jest.mock('react-native', () => {
  const React = require('react');
  
  // Create mock components that work with react-test-renderer
  const mockComponent = (name) => {
    const Component = React.forwardRef((props, ref) => {
      return React.createElement(name, { ...props, ref }, props.children);
    });
    Component.displayName = name;
    return Component;
  };

  return {
    Platform: {
      OS: 'ios',
      select: jest.fn((obj) => obj.ios || obj.default),
      Version: 14,
    },
    StyleSheet: {
      create: jest.fn((styles) => styles),
      flatten: jest.fn((style) => style),
      compose: jest.fn((style1, style2) => [style1, style2]),
      hairlineWidth: 1,
    },
    View: mockComponent('View'),
    Text: mockComponent('Text'),
    Pressable: mockComponent('Pressable'),
    TouchableOpacity: mockComponent('TouchableOpacity'),
    Image: mockComponent('Image'),
    ScrollView: mockComponent('ScrollView'),
    FlatList: mockComponent('FlatList'),
    TextInput: mockComponent('TextInput'),
    SafeAreaView: mockComponent('SafeAreaView'),
    KeyboardAvoidingView: mockComponent('KeyboardAvoidingView'),
    Modal: mockComponent('Modal'),
    ActivityIndicator: mockComponent('ActivityIndicator'),
    useWindowDimensions: jest.fn(() => ({ width: 375, height: 812, scale: 2, fontScale: 2 })),
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812, scale: 2, fontScale: 1 })),
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    },
    BackHandler: {
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
      removeEventListener: jest.fn(),
      exitApp: jest.fn(),
    },
    Alert: {
      alert: jest.fn(),
    },
    PixelRatio: {
      get: jest.fn(() => 2),
      getFontScale: jest.fn(() => 2),
      getPixelSizeForLayoutSize: jest.fn((val) => val * 2),
      roundToNearestPixel: jest.fn((val) => Math.round(val)),
    },
    Animated: {
      Value: jest.fn(() => ({
        setValue: jest.fn(),
        interpolate: jest.fn(() => ({ setValue: jest.fn() })),
      })),
      View: mockComponent('Animated.View'),
      Text: mockComponent('Animated.Text'),
      timing: jest.fn(() => ({ start: jest.fn((cb) => cb && cb()) })),
      spring: jest.fn(() => ({ start: jest.fn() })),
      sequence: jest.fn(),
      parallel: jest.fn(),
    },
    findNodeHandle: jest.fn(),
  };
});

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => false),
  })),
  useLocalSearchParams: jest.fn(() => ({})),
  useSegments: jest.fn(() => []),
  usePathname: jest.fn(() => '/'),
  useNavigationContainerRef: jest.fn(() => ({ current: null })),
  Stack: {
    Screen: jest.fn(() => null),
  },
  Link: jest.fn(({ children }) => children),
}));

// Mock @sentry/react-native
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  wrap: jest.fn((component) => component),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  reactNavigationIntegration: {
    registerNavigationContainer: jest.fn(),
  },
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock react-native-get-random-values
jest.mock('react-native-get-random-values', () => ({}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123'),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

// Mock Google Signin
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    signIn: jest.fn(() => Promise.resolve({ user: { id: 'test', name: 'Test User' } })),
    signOut: jest.fn(() => Promise.resolve()),
    isSignedIn: jest.fn(() => Promise.resolve(false)),
    getTokens: jest.fn(() => Promise.resolve({ accessToken: 'test' })),
  },
  statusCodes: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  },
}));

// Silence console in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Define React Native __DEV__ global
global.__DEV__ = true;
