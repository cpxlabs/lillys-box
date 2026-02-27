import { useCallback, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useRouter } from 'expo-router';

type NavigationLike = {
  canGoBack: () => boolean;
  goBack: () => void;
  getParent: () => NavigationLike | undefined;
};

/**
 * Hook that provides reliable back navigation for screens inside nested navigators.
 *
 * The app uses nested stack navigators (one per game) rendered inside a root stack.
 * On the initial screen of a nested navigator, `navigation.goBack()` alone does nothing
 * because there is no previous screen in that navigator. This hook walks up the parent
 * chain until it finds a navigator that can go back.
 *
 * On web builds the React Navigation parent chain may not reach the Expo Router
 * root navigator, so we fall back to `router.back()` when the chain is exhausted.
 *
 * @param navigation - The navigation object from the screen
 * @param options.cleanup - Optional cleanup function called before navigating (e.g. clear timers)
 * @param options.handleHardwareBack - Whether to intercept the Android hardware back button (default: true)
 */
export function useGameBack(
  navigation: NavigationLike,
  options?: {
    cleanup?: () => void;
    handleHardwareBack?: boolean;
  },
) {
  const { cleanup, handleHardwareBack = true } = options ?? {};
  const router = useRouter();

  const goBack = useCallback(() => {
    cleanup?.();

    // Walk up the navigator tree to find one that can go back
    let nav: NavigationLike | undefined = navigation;
    while (nav) {
      if (nav.canGoBack()) {
        nav.goBack();
        return;
      }
      nav = nav.getParent();
    }

    // Fallback: on web the nested native-stack parent chain may not reach the
    // Expo Router root navigator. Use router.back() to handle this case.
    router.back();
  }, [navigation, cleanup, router]);

  useEffect(() => {
    if (!handleHardwareBack) return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      goBack();
      return true;
    });

    return () => subscription.remove();
  }, [goBack, handleHardwareBack]);

  return goBack;
}
