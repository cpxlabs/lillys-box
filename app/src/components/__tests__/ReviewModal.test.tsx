import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ReviewModal } from '../ReviewModal';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockSubmitReview = jest.fn();
jest.mock('../../hooks/useReview', () => ({
  useReview: () => ({
    submitReview: mockSubmitReview,
    reviews: [],
    summary: null,
    loading: false,
    deleteReview: jest.fn(),
    flagReview: jest.fn(),
    reactToReview: jest.fn(),
  }),
}));

const mockShowToast = jest.fn();
jest.mock('../../context/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

// Mock StarRating so we can trigger rating changes from tests
let _capturedOnRatingChange: ((r: number) => void) | null = null;
jest.mock('../StarRating', () => ({
  StarRating: ({ onRatingChange }: { onRatingChange: (r: number) => void }) => {
    _capturedOnRatingChange = onRatingChange;
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity testID="star-rating" onPress={() => onRatingChange && onRatingChange(4)}>
        <Text>Stars</Text>
      </TouchableOpacity>
    );
  },
}));

jest.mock('../MediaAttachment', () => ({
  MediaAttachment: () => null,
}));

const baseProps = {
  gameId: 'game-1',
  gameName: 'Test Game',
  visible: true,
  onClose: jest.fn(),
};

describe('ReviewModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    _capturedOnRatingChange = null;
    mockSubmitReview.mockResolvedValue(undefined);
  });

  it('renders the game name', () => {
    const { getByText } = render(<ReviewModal {...baseProps} />);
    expect(getByText('Test Game')).toBeTruthy();
  });

  it('renders the submit button', () => {
    const { getByText } = render(<ReviewModal {...baseProps} />);
    expect(getByText('review.submit')).toBeTruthy();
  });

  it('calls onClose when the close button is pressed', () => {
    const onClose = jest.fn();
    const { getByText } = render(<ReviewModal {...baseProps} onClose={onClose} />);
    fireEvent.press(getByText('✕'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('submits review when rating is set and submit is pressed', async () => {
    const { getByTestId, getByText } = render(<ReviewModal {...baseProps} />);
    fireEvent.press(getByTestId('star-rating'));
    fireEvent.press(getByText('review.submit'));
    await waitFor(() => {
      expect(mockSubmitReview).toHaveBeenCalledWith(
        expect.objectContaining({ rating: 4 }),
      );
    });
  });

  it('shows the view-all button when onViewAll is provided', () => {
    const onViewAll = jest.fn();
    const { getByText } = render(<ReviewModal {...baseProps} onViewAll={onViewAll} />);
    expect(getByText('review.viewAll')).toBeTruthy();
  });

  it('calls onViewAll when view-all button is pressed', () => {
    const onViewAll = jest.fn();
    const { getByText } = render(<ReviewModal {...baseProps} onViewAll={onViewAll} />);
    fireEvent.press(getByText('review.viewAll'));
    expect(onViewAll).toHaveBeenCalledTimes(1);
  });

  it('does not call submitReview when rating is 0', () => {
    const { getByText } = render(<ReviewModal {...baseProps} />);
    // Do not set rating — submit should be a no-op
    fireEvent.press(getByText('review.submit'));
    expect(mockSubmitReview).not.toHaveBeenCalled();
  });
});
