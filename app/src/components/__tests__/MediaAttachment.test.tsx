import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MediaAttachment } from '../MediaAttachment';
import { ReviewMedia } from '../../types/review';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params: Record<string, unknown>) => {
      if (key === 'review.maxMediaReached' && params) return `Max ${params.max} items`;
      return key;
    },
  }),
}));

jest.mock('../../utils/logger', () => ({
  logger: { warn: jest.fn(), error: jest.fn() },
}));

// Stub out GifPicker to avoid deep rendering
jest.mock('../GifPicker', () => ({
  GifPicker: ({ onClose: _onClose }: { onClose: () => void }) => null,
}));

const baseProps = {
  media: [] as ReviewMedia[],
  onAdd: jest.fn(),
  onRemove: jest.fn(),
};

describe('MediaAttachment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders add image and add GIF buttons when under the limit', () => {
    const { getByText } = render(<MediaAttachment {...baseProps} />);
    expect(getByText('review.addImage')).toBeTruthy();
    expect(getByText('review.addGif')).toBeTruthy();
  });

  it('does not show add buttons when at max (3 items)', () => {
    const fullMedia: ReviewMedia[] = [
      { type: 'image', uri: 'uri1', width: 100, height: 100 },
      { type: 'image', uri: 'uri2', width: 100, height: 100 },
      { type: 'image', uri: 'uri3', width: 100, height: 100 },
    ];
    const { queryByText, getByText } = render(
      <MediaAttachment {...baseProps} media={fullMedia} />,
    );
    expect(queryByText('review.addImage')).toBeNull();
    expect(queryByText('review.addGif')).toBeNull();
    expect(getByText('Max 3 items')).toBeTruthy();
  });

  it('renders remove buttons for each media item', () => {
    const media: ReviewMedia[] = [
      { type: 'image', uri: 'http://test.com/img.jpg', width: 100, height: 100 },
    ];
    const { getAllByText } = render(<MediaAttachment {...baseProps} media={media} />);
    expect(getAllByText('✕').length).toBeGreaterThanOrEqual(1);
  });

  it('calls onRemove with the correct index when remove is pressed', () => {
    const onRemove = jest.fn();
    const media: ReviewMedia[] = [
      { type: 'image', uri: 'http://test.com/img.jpg', width: 100, height: 100 },
    ];
    const { getAllByText } = render(
      <MediaAttachment {...baseProps} media={media} onRemove={onRemove} />,
    );
    fireEvent.press(getAllByText('✕')[0]);
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  it('shows GIF badge for gif-type media', () => {
    const media: ReviewMedia[] = [
      {
        type: 'gif',
        uri: 'http://tenor.com/gif.gif',
        thumbnailUri: 'http://tenor.com/gif-tiny.gif',
        width: 200,
        height: 200,
      },
    ];
    const { getByText } = render(<MediaAttachment {...baseProps} media={media} />);
    expect(getByText('GIF')).toBeTruthy();
  });
});
