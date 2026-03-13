import { useCallback, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { usePathname, useRouter } from 'expo-router';

type NavigationLike = {
  canGoBack: () => boolean;
  goBack: () => void;
  getParent: () => NavigationLike | undefined;
  getState?: () => { index?: number } | undefined;
};

export function getGameBackFallbackPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);

  if (segments[0] !== 'game') {
    return '/';
  }

  if (segments.length >= 3) {
    return `/game/${segments[1]}`;
  }

  return '/';
}

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
  }
) {
  const { cleanup, handleHardwareBack = true } = options ?? {};
  const router = useRouter();
  const pathname = usePathname();

  const goBack = useCallback(() => {
    cleanup?.();

    // Walk up the navigator tree to find one that can go back
    let nav: NavigationLike | undefined = navigation;
    while (nav) {
      const stateIndex = nav.getState?.()?.index;
      const canGoBack = typeof stateIndex === 'number' ? stateIndex > 0 : nav.canGoBack();

      if (canGoBack) {
        nav.goBack();
        return;
      }
      nav = nav.getParent();
    }

    // Fallback: direct web entry into nested game routes may have no navigable
    // React Navigation history. Replace to a safe route instead of dispatching
    // an unhandled GO_BACK action.
    router.replace(getGameBackFallbackPath(pathname));
  }, [navigation, cleanup, pathname, router]);

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
