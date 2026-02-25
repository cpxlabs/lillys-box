export type ReviewMedia = {
  type: 'image' | 'gif';
  uri: string;
  thumbnailUri?: string;
  width?: number;
  height?: number;
};

export type Review = {
  id: string;
  userId: string;
  userNickname: string;
  userAvatar: string;
  gameId: string;
  rating: number; // 1–5
  comment: string;
  media: ReviewMedia[];
  createdAt: number;
  updatedAt?: number;
  flagged?: boolean;
};

export type ReviewSummary = {
  gameId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>;
};
