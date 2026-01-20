# Palette's Journal

## 2025-05-20 - Accessibility in Selection Screens
**Learning:** Selection screens often use custom `TouchableOpacity` elements that look like radio buttons but lack semantic meaning for screen readers.
**Action:** Always add `accessibilityRole="radio"` and `accessibilityState={{ selected: boolean }}` to custom selection components to ensure screen reader users understand the interaction model.
## 2026-05-21 - [Providing Feedback for Disabled States]
**Learning:** Users often get frustrated when buttons are disabled without explanation (e.g., the Sleep button when energy is high).
**Action:** Always provide a way for the user to understand *why* an action is unavailable, for example, by allowing the disabled button to be pressed and showing a Toast notification with the reason.

## 2025-05-22 - [Accessibility Attributes on Custom Components]
**Learning:** Custom components like `StatusBar` need explicit accessibility attributes (`accessible={true}`, `accessibilityRole`, `accessibilityLabel`, `accessibilityValue`) on the container to be meaningful to screen readers, especially when they combine text and visual indicators.
**Action:** When creating or modifying custom UI components that convey status or value, ensure they expose this information via accessibility props on the container view.
