import { fireEvent, RenderAPI } from '@testing-library/react-native';
import { ReactTestInstance } from 'react-test-renderer';

type NavigationMock = {
  goBack: jest.Mock;
  canGoBack: jest.Mock<boolean, []>;
  getParent: jest.Mock;
};

export function createMockNavigation<T extends object>(overrides?: T) {
  const mockGoBack = jest.fn();
  const mockCanGoBack = jest.fn<boolean, []>(() => true);
  const mockGetParent = jest.fn(() => undefined);

  const navigation = {
    goBack: mockGoBack,
    canGoBack: mockCanGoBack,
    getParent: mockGetParent,
    ...overrides,
  } as NavigationMock & T;

  return {
    navigation,
    mockGoBack,
    mockCanGoBack,
    mockGetParent,
  };
}

type BackNavigationOptions = {
  screenName: string;
  renderScreen: (navigation: NavigationMock) => RenderAPI;
  getBackControl: (screen: RenderAPI) => ReactTestInstance;
};

export function describeStandardBackNavigation({
  screenName,
  renderScreen,
  getBackControl,
}: BackNavigationOptions) {
  describe(`${screenName} back navigation`, () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('navigates back when the back button is pressed', () => {
      const { navigation, mockGoBack } = createMockNavigation();

      const screen = renderScreen(navigation);
      fireEvent.press(getBackControl(screen));

      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });

    it('uses parent navigation when the current navigator cannot go back', () => {
      const { navigation, mockCanGoBack, mockGetParent } = createMockNavigation();
      const parentGoBack = jest.fn();

      mockCanGoBack.mockReturnValue(false);
      mockGetParent.mockReturnValue({
        goBack: parentGoBack,
        canGoBack: () => true,
        getParent: () => undefined,
      });

      const screen = renderScreen(navigation);
      fireEvent.press(getBackControl(screen));

      expect(parentGoBack).toHaveBeenCalledTimes(1);
    });
  });
}
