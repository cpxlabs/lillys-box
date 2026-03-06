'use strict';

// Mock expo/src/winter/ImportMetaRegistry to avoid jest@30 isInsideTestCode errors
// when the lazy getter for __ExpoImportMetaRegistry is accessed from test code.
module.exports = {
  ImportMetaRegistry: {
    url: '',
  },
};
