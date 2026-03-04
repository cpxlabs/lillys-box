# E2E Testing with Maestro

This project uses [Maestro](https://maestro.mobile.dev/) for End-to-End (E2E) testing. Maestro allows us to test the app flows (like creating a pet, feeding, etc.) by interacting with the app just like a user would.

## Prerequisites

1.  **Install Maestro CLI**:
    ```bash
    curl -Ls "https://get.maestro.mobile.dev" | bash
    ```
    For other installation methods (Homebrew, Windows), see the [Maestro Installation Guide](https://maestro.mobile.dev/getting-started/installing-maestro).

2.  **Running Android Emulator / iOS Simulator**:
    You need to have an emulator or simulator running with the app installed.
    - **Android**: `adb devices` should list your emulator.
    - **iOS**: A simulator should be booted.

3.  **App Build**:
    The app must be installed on the emulator/simulator.
    - **Expo Go**: Maestro works with Expo Go, but you need to ensure the app is already open or deep link into it.
    - **Development Build (Recommended)**: Build the android/ios app using `npx expo run:android` or `npx expo run:ios`. This installs the app with the correct package name (`com.cpxlabs.lillysbox`).

## Running Tests

To run the standard flow:

```bash
npm run test:e2e
# or
maestro test e2e/flow.yaml
```

## Test Flows

### `e2e/flow.yaml`
This is the main "Happy Path" test. It covers:
1.  Launching the app.
2.  Handling the Menu (deleting existing pet if needed).
3.  Creating a new Cat named "Maestro".
4.  Verifying the Home Screen appears with action buttons.

## Writing New Tests
Create new `.yaml` files in the `e2e/` folder. Refer to the [Maestro Documentation](https://maestro.mobile.dev/) for commands.

Example:
```yaml
appId: com.cpxlabs.lillysbox
---
- launchApp
- tapOn: "Feed"
- assertVisible: "Hunger"
```

## CI/CD Integration
Maestro can be run in CI environments (like GitHub Actions) by booting an emulator and running the test command. See [Maestro CI Documentation](https://maestro.mobile.dev/ci-cd/github-actions) for details.
