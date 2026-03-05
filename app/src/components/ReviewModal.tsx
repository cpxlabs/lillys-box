import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useReview } from '../hooks/useReview';
import { useToast } from '../context/ToastContext';
import { StarRating } from './StarRating';
import { MediaAttachment } from './MediaAttachment';
import { ReviewMedia } from '../types/review';

const MAX_COMMENT = 500;

type Props = {
  gameId: string;
  gameName: string;
  visible: boolean;
  onClose: () => void;
  onViewAll?: () => void;
};

export const ReviewModal: React.FC<Props> = ({
  gameId,
  gameName,
  visible,
  onClose,
  onViewAll,
}) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { submitReview } = useReview(gameId);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [media, setMedia] = useState<ReviewMedia[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const reset = useCallback(() => {
    setRating(0);
    setComment('');
    setMedia([]);
    setSubmitting(false);
  }, []);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleAddMedia = (item: ReviewMedia) => {
    setMedia((prev) => [...prev, item]);
  };

  const handleRemoveMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await submitReview({ rating, comment: comment.trim(), media });
      showToast(t('review.submitSuccess'), 'success');
      reset();
      onClose();
    } catch {
      showToast(t('review.submitError'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const charCount = comment.length;
  const isOverLimit = charCount > MAX_COMMENT;
  const canSubmit = rating > 0 && !isOverLimit && !submitting;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.backdrop} onPress={handleClose} activeOpacity={1} />

          <View style={styles.sheet}>
            {/* Drag handle */}
            <View style={styles.handle} />

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title} numberOfLines={1}>
                {gameName}
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.body}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Star rating */}
              <Text style={styles.sectionLabel}>{t('review.ratingLabel')}</Text>
              <View style={styles.starsRow}>
                <StarRating value={rating} onRatingChange={setRating} size={40} />
                {rating > 0 && (
                  <Text style={styles.ratingHint}>{t(`review.ratingHint.${rating}`)}</Text>
                )}
              </View>

              {/* Comment */}
              <Text style={styles.sectionLabel}>{t('review.commentLabel')}</Text>
              <TextInput
                style={[styles.commentInput, isOverLimit && styles.commentInputError]}
                placeholder={t('review.commentPlaceholder')}
                placeholderTextColor="#bbb"
                multiline
                numberOfLines={4}
                value={comment}
                onChangeText={setComment}
                maxLength={MAX_COMMENT + 20}
                textAlignVertical="top"
              />
              <Text style={[styles.charCount, isOverLimit && styles.charCountError]}>
                {charCount}/{MAX_COMMENT}
              </Text>

              {/* Media */}
              <Text style={styles.sectionLabel}>{t('review.mediaLabel')}</Text>
              <MediaAttachment
                media={media}
                onAdd={handleAddMedia}
                onRemove={handleRemoveMedia}
              />

              <View style={styles.spacer} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              {onViewAll && (
                <TouchableOpacity onPress={onViewAll} style={styles.viewAllBtn}>
                  <Text style={styles.viewAllText}>{t('review.viewAll')}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={!canSubmit}
                activeOpacity={0.8}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitText}>{t('review.submit')}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    ...Platform.select({
      web: { boxShadow: '0 -4px 20px rgba(0,0,0,0.15)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 12,
      },
    }),
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    flex: 1,
    marginRight: 12,
  },
  closeBtn: {
    fontSize: 18,
    color: '#999',
    fontWeight: '600',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
    marginTop: 4,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  ratingHint: {
    fontSize: 13,
    color: '#9b59b6',
    fontWeight: '500',
  },
  commentInput: {
    backgroundColor: '#fafafa',
    borderWidth: 1.5,
    borderColor: '#e8e8e8',
    borderRadius: 14,
    padding: 12,
    fontSize: 15,
    color: '#333',
    minHeight: 100,
    lineHeight: 22,
  },
  commentInputError: {
    borderColor: '#F44336',
  },
  charCount: {
    fontSize: 12,
    color: '#bbb',
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 16,
  },
  charCountError: {
    color: '#F44336',
  },
  spacer: {
    height: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 10,
  },
  viewAllBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#f5f0ff',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9b59b6',
  },
  submitBtn: {
    flex: 1,
    backgroundColor: '#9b59b6',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: '#ccc',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
