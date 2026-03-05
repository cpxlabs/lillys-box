import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  value: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
};

export const StarRating: React.FC<Props> = ({
  value,
  onRatingChange,
  readonly = false,
  size = 32,
}) => {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value);
        const starEl = (
          <Text
            key={star}
            style={[styles.star, { fontSize: size, color: filled ? '#f0c040' : '#ddd' }]}
          >
            ★
          </Text>
        );

        if (readonly) return starEl;

        return (
          <TouchableOpacity
            key={star}
            onPress={() => onRatingChange?.(star)}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            accessibilityRole="button"
            accessibilityLabel={`${star} star${star !== 1 ? 's' : ''}`}
          >
            {starEl}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginHorizontal: 2,
  },
});
