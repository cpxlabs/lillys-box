# Palette's Journal

## 2025-05-20 - Accessibility in Selection Screens
**Learning:** Selection screens often use custom `TouchableOpacity` elements that look like radio buttons but lack semantic meaning for screen readers.
**Action:** Always add `accessibilityRole="radio"` and `accessibilityState={{ selected: boolean }}` to custom selection components to ensure screen reader users understand the interaction model.
