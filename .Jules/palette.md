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
## 2025-05-22 - [Form Input Feedback]
**Learning:** Users filling out forms need immediate feedback on constraints like character limits. Hiding this information or relying solely on validation errors after submission increases cognitive load.
**Action:** Add visible character counters (`X / MAX`) to text inputs with limits and ensure disabled submit buttons are interactive to explain why they are disabled.

## 2026-05-23 - [Accessible Progress Bars]
**Learning:** Visual status bars (like health or hunger) are invisible to screen readers without semantic roles. Hardcoded labels in these components also break accessibility for non-English speakers.
**Action:** Use `accessibilityRole="progressbar"` with `accessibilityValue` for status indicators, and ensure all labels passed to `accessibilityLabel` are localized using i18n keys.
## 2025-05-23 - [Accessible Progress Bars]
**Learning:** Visual status bars (like health or hunger) are invisible to screen readers without semantic roles. Hardcoded labels in these components also break accessibility for non-English speakers.
**Action:** Use `accessibilityRole="progressbar"` with `accessibilityValue` for status indicators, and ensure all labels passed to `accessibilityLabel` are localized using i18n keys.

## 2026-01-21 - [Localized Accessibility Labels]
**Learning:** Language selectors represented by abbreviations (EN/PT) or flags are ambiguous for screen readers. They need full language names as labels.
**Action:** When implementing language toggles, ensure `accessibilityLabel` uses the full localized name of the language (e.g., "English" instead of "EN") to provide clear context.
## 2026-05-24 - [Testing Reanimated Components]
**Learning:** Testing components using `react-native-reanimated` with `react-test-renderer` requires strict environment mocking, specifically `findNodeHandle` in `react-native` mock, or mocking the library entirely to avoid DOM-related errors (like `getBoundingClientRect`).
**Action:** When adding Reanimated to existing components, update `jest.setup.js` to include `findNodeHandle: jest.fn()` in the `react-native` mock, or wrap the component in a test that mocks `react-native-reanimated` logic.

## 2026-05-25 - [Consistent Constraint Feedback]
**Learning:** Reusing existing semantic color tokens (like `COLORS.STAT_LEVELS` for health/stats) for form validation (e.g., character limits) creates a consistent visual language where "Low Health" (Red) maps to "Limit Reached" (Red).
**Action:** Before creating new color tokens for warnings/errors, check if existing semantic tokens can be reused to maintain design system consistency.
