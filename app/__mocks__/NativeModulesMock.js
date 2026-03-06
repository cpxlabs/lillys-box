/**
 * Mock for react-native/Libraries/BatchedBridge/NativeModules.
 *
 * jest-expo@55 requires this module via `.default`, but react-native's own
 * jest setup mock exports a plain object (no `.default`). This wrapper adds
 * the `.default` property so that jest-expo's preset/setup.js can build its
 * Expo-module mocks without throwing "Object.defineProperty called on
 * non-object".
 */

const nativeModules = {
  AlertManager: { alertWithArgs: jest.fn() },
  AsyncLocalStorage: {
    multiGet: jest.fn((keys, cb) => process.nextTick(() => cb(null, []))),
    multiSet: jest.fn((entries, cb) => process.nextTick(() => cb(null))),
    multiRemove: jest.fn((keys, cb) => process.nextTick(() => cb(null))),
    multiMerge: jest.fn((entries, cb) => process.nextTick(() => cb(null))),
    clear: jest.fn(cb => process.nextTick(() => cb(null))),
    getAllKeys: jest.fn(cb => process.nextTick(() => cb(null, []))),
  },
  DeviceInfo: {
    getConstants() {
      return {
        Dimensions: {
          window: { fontScale: 2, height: 1334, scale: 2, width: 750 },
          screen: { fontScale: 2, height: 1334, scale: 2, width: 750 },
        },
      };
    },
  },
  DevSettings: { addMenuItem: jest.fn(), reload: jest.fn() },
  ImageLoader: {
    getSize: jest.fn(url => Promise.resolve([320, 240])),
    prefetchImage: jest.fn(),
    queryCache: jest.fn(),
  },
  ImageViewManager: {
    getSize: jest.fn((uri, success) => process.nextTick(() => success(320, 240))),
    prefetchImage: jest.fn(),
  },
  Linking: {
    openURL: jest.fn(() => Promise.resolve()),
    canOpenURL: jest.fn(() => Promise.resolve(true)),
    getInitialURL: jest.fn(() => Promise.resolve()),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  NativeUnimoduleProxy: {
    viewManagersMetadata: {},
    exportedMethods: {},
    callMethod: jest.fn(() => Promise.resolve()),
  },
  PlatformConstants: {
    getConstants() {
      return {
        reactNativeVersion: { major: 0, minor: 77, patch: 3 },
      };
    },
  },
  StatusBarManager: {
    setColor: jest.fn(),
    setStyle: jest.fn(),
    setHidden: jest.fn(),
    setBackgroundColor: jest.fn(),
    setTranslucent: jest.fn(),
    getConstants: () => ({ HEIGHT: 42 }),
  },
  Timing: { createTimer: jest.fn(), deleteTimer: jest.fn() },
  UIManager: {},
  I18nManager: {
    allowRTL: jest.fn(),
    forceRTL: jest.fn(),
    swapLeftAndRightInRTL: jest.fn(),
    getConstants: () => ({ isRTL: false, doLeftAndRightSwapInRTL: true }),
  },
};

module.exports = {
  __esModule: true,
  default: nativeModules,
};
