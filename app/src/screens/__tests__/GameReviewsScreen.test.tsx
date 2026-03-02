import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GameReviewsScreen } from '../GameReviewsScreen';

// ── Mocks ──────────────────────────────────────────────────────────────────

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params: Record<string, unknown>) => {
      if (params && params.count !== undefined) return `${params.count} reviews`;
      return key;
    },
  }),
}));

const mockDeleteReview = jest.fn();
const mockFlagReview = jest.fn();
const mockReactToReview = jest.fn();

const mockUseReview = jest.fn();
jest.mock('../../hooks/useReview', () => ({
  useReview: () => mockUseReview(),
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'user-1', name: 'Test User' } }),
}));

jest.mock('../../components/StarRating', () => ({
  StarRating: () => null,
}));

jest.mock('../../components/ReviewModal', () => ({
  ReviewModal: ({ visible }: { visible: boolean }) => {
    if (!visible) return null;
    const { Text } = require('react-native');
    return <Text testID="review-modal">ReviewModal</Text>;
  },
}));

const baseReviewHook = {
  reviews: [],
  summary: null,
  loading: false,
  deleteReview: mockDeleteReview,
  flagReview: mockFlagReview,
  reactToReview: mockReactToReview,
  submitReview: jest.fn(),
  refreshReviews: jest.fn(),
};

const baseProps = {
  gameId: 'game-1',
  gameName: 'Balloon Float',
  onBack: jest.fn(),
};

// ── Tests ──────────────────────────────────────────────────────────────────

describe('GameReviewsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseReview.mockReturnValue(baseReviewHook);
  });

  it('renders game name in header', () => {
    const { getByText } = render(<GameReviewsScreen {...baseProps} />);
    expect(getByText('Balloon Float')).toBeTruthy();
  });

  it('shows back button and calls onBack when pressed', () => {
    const onBack = jest.fn();
    const { getByText } = render(<GameReviewsScreen {...baseProps} onBack={onBack} />);
    fireEvent.press(getByText(/common\.back/));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('shows empty state when there are no reviews', () => {
    const { getByText } = render(<GameReviewsScreen {...baseProps} />);
    expect(getByText('review.noReviews')).toBeTruthy();
  });

  it('shows loading indicator while loading', () => {
    mockUseReview.mockReturnValue({ ...baseReviewHook, loading: true });
    const { UNSAFE_getByType } = render(<GameReviewsScreen {...baseProps} />);
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('renders reviews when available', () => {
    const reviews = [
      {
        id: 'r1',
        userId: 'other-user',
        userNickname: 'Alice',
        userAvatar: '🐱',
        rating: 4,
        comment: 'Great game!',
        media: [],
        createdAt: Date.now(),
        helpfulUserIds: [],
        flagged: false,
      },
    ];
    mockUseReview.mockReturnValue({ ...baseReviewHook, reviews });
    const { getByText } = render(<GameReviewsScreen {...baseProps} />);
    expect(getByText('Alice')).toBeTruthy();
    expect(getByText('Great game!')).toBeTruthy();
  });

  it('shows delete button for own reviews', () => {
    const reviews = [
      {
        id: 'r1',
        userId: 'user-1', // same as mocked user
        userNickname: 'Me',
        userAvatar: '🐶',
        rating: 5,
        comment: 'My review',
        media: [],
        createdAt: Date.now(),
        helpfulUserIds: [],
        flagged: false,
      },
    ];
    mockUseReview.mockReturnValue({ ...baseReviewHook, reviews });
    const { getByText } = render(<GameReviewsScreen {...baseProps} />);
    expect(getByText('review.delete')).toBeTruthy();
  });

  it('calls deleteReview when delete button is pressed', () => {
    const reviews = [
      {
        id: 'r1',
        userId: 'user-1',
        userNickname: 'Me',
        userAvatar: '🐶',
        rating: 5,
        comment: 'My review',
        media: [],
        createdAt: Date.now(),
        helpfulUserIds: [],
        flagged: false,
      },
    ];
    mockUseReview.mockReturnValue({ ...baseReviewHook, reviews });
    const { getByText } = render(<GameReviewsScreen {...baseProps} />);
    fireEvent.press(getByText('review.delete'));
    expect(mockDeleteReview).toHaveBeenCalledWith('r1');
  });

  it('shows write review FAB', () => {
    const { getByText } = render(<GameReviewsScreen {...baseProps} />);
    expect(getByText('review.writeReview')).toBeTruthy();
  });

  it('opens ReviewModal when write review FAB is pressed', () => {
    const { getByText, getByTestId } = render(<GameReviewsScreen {...baseProps} />);
    fireEvent.press(getByText('review.writeReview'));
    expect(getByTestId('review-modal')).toBeTruthy();
  });

  it('shows sort buttons', () => {
    const { getByText } = render(<GameReviewsScreen {...baseProps} />);
    expect(getByText('review.sort.recent')).toBeTruthy();
    expect(getByText('review.sort.helpful')).toBeTruthy();
    expect(getByText('review.sort.highest')).toBeTruthy();
    expect(getByText('review.sort.lowest')).toBeTruthy();
  });

  it('shows total reviews count', () => {
    mockUseReview.mockReturnValue({
      ...baseReviewHook,
      summary: { totalReviews: 5, averageRating: 4.2, ratingDistribution: { 1: 0, 2: 0, 3: 1, 4: 2, 5: 2 } },
    });
    const { getByText } = render(<GameReviewsScreen {...baseProps} />);
    expect(getByText('5 reviews')).toBeTruthy();
  });
});
