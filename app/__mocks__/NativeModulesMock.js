'use strict';

// Provides a NativeModules mock compatible with both react-native and jest-expo@55+.
// jest-expo@55 accesses NativeModules via `.default`, so this export needs both
// the flat CommonJS export and a `.default` self-reference.
const mockNativeModules = {
  UIManager: {},
  Linking: {},
  AlertManager: {
    alertWithArgs: jest.fn(),
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
};

module.exports = mockNativeModules;
module.exports.default = mockNativeModules;
