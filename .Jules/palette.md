# Palette's Journal

## 2025-05-20 - Accessibility in Selection Screens
**Learning:** Selection screens often use custom `TouchableOpacity` elements that look like radio buttons but lack semantic meaning for screen readers.
**Action:** Always add `accessibilityRole="radio"` and `accessibilityState={{ selected: boolean }}` to custom selection components to ensure screen reader users understand the interaction model.
## 2026-05-21 - [Providing Feedback for Disabled States]
**Learning:** Users often get frustrated when buttons are disabled without explanation (e.g., the Sleep button when energy is high).
**Action:** Always provide a way for the user to understand *why* an action is unavailable, for example, by allowing the disabled button to be pressed and showing a Toast notification with the reason.

## 2025-05-22 - [Form Input Feedback]
**Learning:** Users filling out forms need immediate feedback on constraints like character limits. Hiding this information or relying solely on validation errors after submission increases cognitive load.
**Action:** Add visible character counters (`X / MAX`) to text inputs with limits and ensure disabled submit buttons are interactive to explain why they are disabled.

## 2025-05-23 - [Accessible Progress Bars]
**Learning:** Visual progress bars implemented with `View`s are invisible to screen readers, leaving users unaware of status values like Health or Hunger.
**Action:** Always add `accessibilityRole="progressbar"`, `accessibilityLabel`, and `accessibilityValue` to the container `View` of custom progress bar components.
