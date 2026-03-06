'use strict';

// Mock expo/src/winter to avoid jest@30 isInsideTestCode compatibility issues.
// The native runtime sets up a lazy getter for __ExpoImportMetaRegistry that
// jest@30 cannot execute after setup files have run.
