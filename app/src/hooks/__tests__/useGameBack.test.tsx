import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { BackHandler, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameBack } from '../useGameBack';
import { createMockNavigation } from '../../testUtils/backNavigation';

type TestComponentProps = {
  navigation: Parameters<typeof useGameBack>[0];
  cleanup?: jest.Mock;
  handleHardwareBack?: boolean;
};

const mockUseRouter = useRouter as jest.Mock;

const TestComponent: React.FC<TestComponentProps> = ({
  navigation,
  cleanup,
  handleHardwareBack,
}) => {
  const goBack = useGameBack(navigation, { cleanup, handleHardwareBack });

  return (
    <TouchableOpacity onPress={goBack}>
      <Text>go back</Text>
    </TouchableOpacity>
  );
};

describe('useGameBack', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('runs cleanup and navigates back on the current navigator when possible', () => {
    const routerBack = jest.fn();
    const cleanup = jest.fn();
    const { navigation, mockGoBack } = createMockNavigation();

    mockUseRouter.mockReturnValue({ back: routerBack });

    const { getByText } = render(
      <TestComponent navigation={navigation} cleanup={cleanup} />
    );

    fireEvent.press(getByText('go back'));

    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(mockGoBack).toHaveBeenCalledTimes(1);
    expect(routerBack).not.toHaveBeenCalled();
  });

  it('walks up the parent chain until it finds a navigator that can go back', () => {
    const routerBack = jest.fn();
    const { navigation, mockCanGoBack, mockGetParent } = createMockNavigation();
    const parentGoBack = jest.fn();

    mockUseRouter.mockReturnValue({ back: routerBack });
    mockCanGoBack.mockReturnValue(false);
    mockGetParent.mockReturnValue({
      canGoBack: () => false,
      goBack: jest.fn(),
      getParent: () => ({
        canGoBack: () => true,
        goBack: parentGoBack,
        getParent: () => undefined,
      }),
    });

    const { getByText } = render(<TestComponent navigation={navigation} />);

    fireEvent.press(getByText('go back'));

    expect(parentGoBack).toHaveBeenCalledTimes(1);
    expect(routerBack).not.toHaveBeenCalled();
  });

  it('falls back to router.back when no navigator in the chain can go back', () => {
    const routerBack = jest.fn();
    const { navigation, mockCanGoBack, mockGetParent } = createMockNavigation();

    mockUseRouter.mockReturnValue({ back: routerBack });
    mockCanGoBack.mockReturnValue(false);
    mockGetParent.mockReturnValue({
      canGoBack: () => false,
      goBack: jest.fn(),
      getParent: () => undefined,
    });

    const { getByText } = render(<TestComponent navigation={navigation} />);

    fireEvent.press(getByText('go back'));

    expect(routerBack).toHaveBeenCalledTimes(1);
  });

  it('registers a hardware back handler that uses the same navigation logic', () => {
    const routerBack = jest.fn();
    const cleanup = jest.fn();
    const { navigation, mockGoBack } = createMockNavigation();

    mockUseRouter.mockReturnValue({ back: routerBack });

    render(<TestComponent navigation={navigation} cleanup={cleanup} />);

    expect(BackHandler.addEventListener).toHaveBeenCalledTimes(1);

    const [, onHardwareBack] = (BackHandler.addEventListener as jest.Mock).mock.calls[0];
    let handled = false;

    act(() => {
      handled = onHardwareBack();
    });

    expect(handled).toBe(true);
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(mockGoBack).toHaveBeenCalledTimes(1);
    expect(routerBack).not.toHaveBeenCalled();
  });

  it('skips hardware back registration when disabled', () => {
    const routerBack = jest.fn();
    const { navigation } = createMockNavigation();

    mockUseRouter.mockReturnValue({ back: routerBack });

    render(<TestComponent navigation={navigation} handleHardwareBack={false} />);

    expect(BackHandler.addEventListener).not.toHaveBeenCalled();
  });
});
