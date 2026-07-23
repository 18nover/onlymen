# Accessibility Testing

## Overview

Accessibility testing procedures for mobile applications, covering screen readers, keyboard navigation, color contrast, and automated tools.

## Screen Reader Testing

### VoiceOver (iOS)

```
Testing Steps:
1. Enable VoiceOver: Settings > Accessibility > VoiceOver
2. Navigate using rotor: Two-finger rotate gesture
3. Test all interactive elements
4. Verify announcement order is logical
5. Check custom actions are available

Key Gestures:
- Tap: Select element
- Double-tap: Activate element
- Swipe right/left: Navigate next/previous
- Two-finger swipe up: Read all
- Rotor: Change navigation mode
```

### TalkBack (Android)

```
Testing Steps:
1. Enable TalkBack: Settings > Accessibility > TalkBack
2. Navigate by swiping right/left
3. Verify heading hierarchy
4. Check content descriptions
5. Test custom actions

Key Gestures:
- Tap: Select element
- Double-tap: Activate
- Swipe right/left: Navigate
- Two-finger swipe up: Read from top
- L-shape gesture: Local context menu
```

### Screen Reader Checklist

| Element               | VoiceOver Check                      | TalkBack Check                       |
|-----------------------|--------------------------------------|--------------------------------------|
| Button                | Announces label + action             | Announces label + action             |
| Image                 | Has accessible label                 | Has content description              |
| Heading               | Identifies heading level             | Identifies heading level             |
| Link                  | Announces link purpose               | Announces link purpose               |
| Form field            | Announces label + required + error   | Announces label + required + error   |
| Switch/Toggle         | Announces state (on/off)             | Announces state (on/off)             |
| Modal                 | Focus moves to modal                 | Focus moves to modal                 |
| Custom component      | Announces all relevant info          | Announces all relevant info          |

### Common Issues

```javascript
// BAD: No accessible label
<Image source={avatarUrl} />

// GOOD: Has accessible label
<Image source={avatarUrl} accessibilityLabel="Profile picture" />

// BAD: Not accessible
<View onPress={handlePress}>
  <Text>Submit</Text>
</View>

// GOOD: Accessible button
<Pressable onPress={handlePress} accessibilityRole="button">
  <Text>Submit</Text>
</Pressable>

// BAD: No state announcement
<Switch value={isEnabled} />

// GOOD: Announces state
<Switch
  value={isEnabled}
  accessibilityLabel="Dark mode"
  accessibilityState={{ checked: isEnabled }}
/>
```

## Keyboard Navigation

### Tab Order

```
Testing Steps:
1. Connect external keyboard
2. Press Tab to navigate forward
3. Press Shift+Tab to navigate backward
4. Press Enter/Space to activate focused element
5. Verify focus indicator is visible
6. Check no keyboard traps exist
```

### Focus Management

```javascript
// Focus on modal open
const Modal = ({ isOpen, onClose }) => {
  const closeRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      closeRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <View accessibilityViewIsModal={true}>
      <Text>Modal Content</Text>
      <Pressable ref={closeRef} onPress={onClose}>
        <Text>Close</Text>
      </Pressable>
    </View>
  );
};
```

### Keyboard Shortcuts

| Shortcut           | Action                              |
|--------------------|-------------------------------------|
| Tab                | Next interactive element            |
| Shift+Tab          | Previous interactive element        |
| Enter/Space        | Activate button/link                |
| Escape             | Close modal/dropdown                |
| Arrow keys         | Navigate within composite widget    |
| Home/End           | Move to first/last item             |

## Color Contrast

### WCAG Requirements

| Level     | Normal Text    | Large Text     | UI Components  |
|-----------|----------------|----------------|----------------|
| AA        | 4.5:1          | 3:1            | 3:1            |
| AAA       | 7:1            | 4.5:1          | 4.5:1          |

### Contrast Checking

```javascript
// Use a contrast checker library
import { getContrastRatio } from 'color-name';

const ratio = getContrastRatio('#000000', '#FFFFFF');  // 21:1
const ratio2 = getContrastRatio('#767676', '#FFFFFF'); // 4.54:1

console.log(ratio >= 4.5 ? 'Passes AA' : 'Fails AA');
```

### Common Contrast Issues

| Element                 | Minimum Contrast | Common Issue                     |
|-------------------------|------------------|----------------------------------|
| Body text               | 4.5:1            | Gray on white                    |
| Placeholder text        | 4.5:1            | Light gray too light             |
| Disabled text           | 3:1              | Often too low contrast           |
| Links in body text      | 4.5:1            | Color-only differentiation       |
| Focus indicators        | 3:1              | Removed by CSS reset             |
| Error messages          | 4.5:1            | Red on white                     |
| Icons                   | 3:1              | Decorative vs informative        |

### Color-Only Information

```javascript
// BAD: Error indicated only by color
<Text style={{ color: 'red' }}>Invalid input</Text>

// GOOD: Error with icon and text
<View>
  <Icon name="alert-circle" color="red" />
  <Text>Invalid input</Text>
</View>

// BAD: Required field indicated only by color
<Text style={{ color: 'red' }}>*</Text>

// GOOD: Required with text
<Text> Email (required)</Text>
```

## Font Scaling

### Dynamic Type (iOS)

```javascript
// Use system font scaling
<Text style={{ fontSize: 16 }}>Normal text</Text>

// Respect user's font size preference
import { useFontScale } from 'react-native-accessibility';

const FontScaledText = ({ children }) => {
  const fontScale = useFontScale();
  return (
    <Text style={{ fontSize: 16 * fontScale }}>
      {children}
    </Text>
  );
};
```

### Text Scaling (Android)

```javascript
// Android respects system font size
// Test with different font sizes in settings

// Verify text doesn't overflow
const ResponsiveText = ({ text, maxLines = 2 }) => (
  <Text
    numberOfLines={maxLines}
    adjustsFontSizeToFit={true}
    minimumFontScale={0.8}
  >
    {text}
  </Text>
);
```

### Font Scaling Checklist

| Size Setting      | Test Case                              | Expected                          |
|-------------------|----------------------------------------|-----------------------------------|
| Small (85%)       | All text readable                      | No truncation                     |
| Default (100%)    | All text readable                      | Normal layout                     |
| Large (115%)      | All text readable                      | Layout adapts                     |
| Extra Large (150%)| All text readable                      | No overflow                       |
| Maximum (200%)    | Core content readable                  | Scrollable if needed              |

## Focus Management

### Focus Indicators

```javascript
// Ensure visible focus indicator
const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: 'transparent',
  },
  buttonFocused: {
    borderColor: '#005FCC',  // High contrast focus ring
  },
});

// React Native Web focus styles
const focusStyles = {
  ':focus-visible': {
    outline: '2px solid #005FCC',
    outlineOffset: '2px',
  },
};
```

### Focus Order Testing

```javascript
// Test that focus order matches visual order
// 1. Tab through the screen
// 2. Verify focus moves logically
// 3. Check no focus traps exist
// 4. Verify modals trap focus appropriately
// 5. Check focus returns after modal close
```

## ARIA Attributes

### Common ARIA Patterns

```javascript
// Loading state
<ActivityIndicator
  accessibilityLabel="Loading"
  accessibilityState={{ busy: true }}
/>

// Expandable section
<Pressable
  accessibilityRole="button"
  accessibilityState={{ expanded: isExpanded }}
  accessibilityHint="Double tap to expand"
>
  <Text>Section Title</Text>
</Pressable>

// Progress bar
<View
  accessibilityRole="progressbar"
  accessibilityValue={{
    min: 0,
    max: 100,
    now: progress,
    text: `${progress}% complete`
  }}
/>

// Selected state
<Pressable
  accessibilityState={{ selected: isSelected }}
  accessibilityRole="selected"
>
  <Text>Option</Text>
</Pressable>
```

### Accessibility Roles

| Role              | Use Case                              | Example                             |
|-------------------|---------------------------------------|-------------------------------------|
| button            | Interactive element                   | Submit, Cancel                      |
| link              | Navigation element                    | "Learn more" link                   |
| header            | Section heading                       | Screen titles                       |
| image             | Meaningful image                      | Photo, icon with meaning            |
| text              | Static text                           | Labels, descriptions                |
| search            | Search input                          | Search bar                          |
| adjustable        | Slider control                        | Volume, brightness                  |
| selected          | Selected item                         | Active tab                          |
| disabled          | Disabled element                      | Greyed out button                   |
| checked           | Checkbox state                        | Checkbox, switch                    |
| expanded          | Expandable section                    | Accordion header                    |
| modal             | Modal dialog                          | Popup, alert                        |
| progressbar       | Progress indicator                    | Upload progress                     |
| none              | Decorative element                    | Decorative image                    |

## Automated Testing Tools

### React Native Testing Library

```javascript
import { render, screen } from '@testing-library/react-native';

test('button has accessible label', () => {
  render(<Button title="Submit" onPress={() => {}} />);
  expect(screen.getByRole('button', { name: 'Submit' })).toBeTruthy();
});

test('form field has label', () => {
  render(<TextInput label="Email" />);
  expect(screen.getByLabelText('Email')).toBeTruthy();
});
```

### Accessibility Scanner (Android)

```bash
# Install Accessibility Scanner from Play Store
# Enable in Settings > Accessibility > Accessibility Scanner
# Use floating button to scan screens
```

### Xcode Accessibility Inspector

```
1. Open Xcode → Open Developer Tool → Accessibility Inspector
2. Point at elements to inspect
3. Check accessibility properties
4. Test with VoiceOver via inspector
```

### Automated Checks

```bash
# ESLint plugin for accessibility
npm install eslint-plugin-react-native-a11y

# Add to .eslintrc
{
  "plugins": ["react-native-a11y"],
  "extends": ["plugin:react-native-a11y/recommended"]
}
```

## Testing Checklist

- [ ] All images have meaningful alt text
- [ ] All buttons have accessible labels
- [ ] All form fields have labels
- [ ] Focus order matches visual order
- [ ] Focus indicators are visible
- [ ] Color contrast meets AA minimum
- [ ] Text scales properly (up to 200%)
- [ ] No information conveyed by color alone
- [ ] Screen reader announces all content logically
- [ ] Custom components have proper ARIA roles
- [ ] Modals trap focus appropriately
- [ ] Error messages are announced
- [ ] Loading states are announced
- [ ] Keyboard navigation works for all features
- [ ] Touch targets are at least 44x44 points
