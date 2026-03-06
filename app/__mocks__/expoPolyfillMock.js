/**
 * Mock for expo-modules-core/src/polyfill/dangerous-internal.
 *
 * In expo@55 this polyfill installs JSI-based globals (EventEmitter,
 * NativeModule, SharedObject, etc.) on globalThis.expo.  When running tests
 * against expo@50 we only need to make the object exist; individual tests mock
 * whichever expo-modules they actually need.
 */
module.exports = {
  installExpoGlobalPolyfill: function () {
    if (!globalThis.expo) {
      globalThis.expo = {};
    }
    if (!globalThis.expo.EventEmitter) {
      globalThis.expo.EventEmitter = class EventEmitter {
        addListener() {}
        removeListener() {}
        emit() {}
      };
    }
    if (!globalThis.expo.NativeModule) {
      globalThis.expo.NativeModule = class NativeModule {};
    }
    if (!globalThis.expo.SharedObject) {
      globalThis.expo.SharedObject = class SharedObject {};
    }
  },
};
