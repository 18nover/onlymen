# ALF — Atomic Layout Framework

## Overview

ALF (Atomic Layout Framework) is a composable, theme-aware styling system for building cross-platform UIs. It provides atomic layout primitives, theme tokens, and platform-aware utilities to create consistent interfaces across web and native (React Native / Expo).

---

## Static Atoms

Static atoms are fixed-value layout primitives that never change with theme or platform. They provide predictable, constant values for spacing, sizing, radii, and opacity.

### Syntax

```ts
import { a } from '@alf/core';

// Spacing
a.space.xs   // 4px
a.space.sm   // 8px
a.space.md   // 12px
a.space.lg   // 16px
a.space.xl   // 24px
a.space['2xl'] // 32px
a.space['3xl'] // 48px

// Border Radius
a.radius.sm   // 4px
a.radius.md   // 8px
a.radius.lg   // 12px
a.radius.xl   // 16px
a.radius.full // 9999px (pill)

// Opacity
a.opacity.disabled  // 0.38
a.opacity.hover     // 0.08
a.opacity.active    // 0.12
a.opacity.overlay   // 0.50

// Shadows
a.shadow.sm
a.shadow.md
a.shadow.lg
a.shadow.xl
```

### When to Use Static Atoms

- Fixed spacing in non-themable contexts
- Layout dimensions that should never change
- Cross-platform constants (radius, opacity)
- Internal component structure that is theme-independent

---

## Theme Atoms

Theme atoms read values from the active theme context. They adapt to light/dark mode, custom branding, and user preferences.

### Syntax

```ts
import { t } from '@alf/core';

// Colors (semantic)
t.colors.primary
t.colors.primaryForeground
t.colors.secondary
t.colors.secondaryForeground
t.colors.background
t.colors.foreground
t.colors.card
t.colors.cardForeground
t.colors.muted
t.colors.mutedForeground
t.colors.accent
t.colors.accentForeground
t.colors.destructive
t.colors.destructiveForeground
t.colors.border
t.colors.input
t.colors.ring

// Status Colors
t.colors.success
t.colors.successForeground
t.colors.warning
t.colors.warningForeground
t.colors.error
t.colors.errorForeground
t.colors.info
t.colors.infoForeground

// Typography
t.font.family.sans
t.font.family.serif
t.font.family.mono
t.font.size.xs
t.font.size.sm
t.font.size.base
t.font.size.lg
t.font.size.xl
t.font.size['2xl']
t.font.size['3xl']

// Borders
t.border.color
t.border.width

// Custom Tokens
t.atoms.surface.primary
t.atoms.surface.secondary
t.atoms.surface.elevated
t.atoms.interactive.default
t.atoms.interactive.hover
t.atoms.interactive.pressed
```

### Theme Token Structure

```ts
interface ThemeTokens {
  colors: SemanticColors;
  fonts: FontTokens;
  border: BorderTokens;
  atoms: {
    surface: SurfaceTokens;
    interactive: InteractiveTokens;
    text: TextTokens;
    icon: IconTokens;
  };
}
```

---

## Platform Utilities

Platform utilities allow you to write platform-conditional styles that resolve at runtime.

### `web()` — Web-Only Styles

```ts
import { web } from '@alf/core';

const styles = web({
  cursor: 'pointer',
  userSelect: 'none',
  outline: 'none',
  ':hover': {
    backgroundColor: t.colors.accent,
  },
  '::before': {
    content: '""',
    position: 'absolute',
  },
});

// web() returns undefined on native platforms
```

### `native()` — Native-Only Styles

```ts
import { native } from '@alf/core';

const styles = native({
  elevation: 4,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
});

// native() returns undefined on web
```

### Platform-Specific Compositions

```ts
import { web, native, merge } from '@alf/core';

const styles = merge(
  {
    // Shared styles
    padding: a.space.md,
    borderRadius: a.radius.md,
  },
  web({
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': { transform: 'scale(1.02)' },
  }),
  native({
    activeOpacity: 0.8,
  }),
);
```

---

## Component Patterns

### Button

```tsx
import { atoms, useTheme } from '@alf/core';

function Button({ variant = 'primary', size = 'md', children }) {
  const theme = useTheme();

  const containerStyles = merge(
    atoms.flex.row,
    atoms.align.center,
    atoms.justify.center,
    {
      paddingVertical: size === 'sm' ? a.space.xs : a.space.sm,
      paddingHorizontal: size === 'sm' ? a.space.md : a.space.lg,
      borderRadius: a.radius.md,
      backgroundColor: variant === 'primary'
        ? t.colors.primary
        : 'transparent',
      borderWidth: variant === 'outline' ? 1 : 0,
      borderColor: t.colors.border,
    },
    web({ cursor: 'pointer', transition: 'all 0.15s ease' }),
    native({ activeOpacity: 0.7 }),
  );

  return (
    <Pressable style={containerStyles}>
      <Text style={{ color: t.colors.primaryForeground }}>
        {children}
      </Text>
    </Pressable>
  );
}
```

### Card

```tsx
function Card({ children }) {
  return (
    <View
      style={merge(
        {
          padding: a.space.lg,
          borderRadius: a.radius.lg,
          backgroundColor: t.colors.card,
          borderWidth: 1,
          borderColor: t.colors.border,
        },
        web({ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }),
        native({ elevation: 2 }),
      )}
    >
      {children}
    </View>
  );
}
```

### Stack

```tsx
function Stack({ direction = 'vertical', gap = 'md', children }) {
  return (
    <View
      style={merge(
        direction === 'vertical' ? atoms.flex.col : atoms.flex.row,
        { gap: a.space[gap] },
      )}
    >
      {children}
    </View>
  );
}
```

---

## Theming

### Theme Provider

```tsx
import { ThemeProvider } from '@alf/core';

function App() {
  return (
    <ThemeProvider theme="system" defaultMode="light">
      <RootNavigator />
    </ThemeProvider>
  );
}
```

### Theme Modes

| Mode     | Behavior                                      |
|----------|-----------------------------------------------|
| `light`  | Always uses light color palette               |
| `dark`   | Always uses dark color palette                |
| `system` | Follows device OS setting                     |

### Custom Theme

```ts
import { defineTheme } from '@alf/core';

const customTheme = defineTheme({
  name: 'branded',
  extends: 'light',
  tokens: {
    colors: {
      primary: '#6366F1',
      primaryForeground: '#FFFFFF',
      secondary: '#EC4899',
      accent: '#F59E0B',
    },
    atoms: {
      surface: {
        primary: '#FFFFFF',
        secondary: '#F8FAFC',
        elevated: '#FFFFFF',
      },
    },
  },
});

<ThemeProvider theme={customTheme}>
```

### Use Theme in Components

```tsx
import { useTheme, useThemeMode } from '@alf/core';

function MyComponent() {
  const theme = useTheme();
  const { mode, setMode } = useThemeMode();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Button onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </Button>
    </View>
  );
}
```

---

## Dark Mode

### Color Adjustments

Dark mode inverts the luminance hierarchy while preserving brand identity:

| Token                  | Light Mode    | Dark Mode     |
|------------------------|---------------|---------------|
| `colors.background`    | `#FFFFFF`     | `#0A0A0A`     |
| `colors.foreground`    | `#0A0A0A`     | `#FAFAFA`     |
| `colors.card`          | `#FFFFFF`     | `#171717`     |
| `colors.muted`         | `#F1F5F9`     | `#1E293B`     |
| `colors.border`        | `#E2E8F0`     | `#334155`     |
| `colors.primary`       | `#6366F1`     | `#818CF8`     |
| `colors.destructive`   | `#EF4444`     | `#F87171`     |

### Implementation

```ts
// ALF handles dark mode automatically via ThemeProvider
// Colors adjust based on the current mode

const bgColor = useThemeColor('background');   // auto dark/light
const textColor = useThemeColor('foreground');  // auto dark/light
```

---

## Custom Tokens

### Register Custom Tokens

```ts
// theme.tokens.ts
import { defineTokens } from '@alf/core';

export const customTokens = defineTokens({
  colors: {
    brand: {
      50: '#EEF2FF',
      100: '#E0E7FF',
      200: '#C7D2FE',
      300: '#A5B4FC',
      400: '#818CF8',
      500: '#6366F1',
      600: '#4F46E5',
      700: '#4338CA',
      800: '#3730A3',
      900: '#312E81',
    },
  },
  spacing: {
    '2xs': 2,
    '3xl': 48,
    '4xl': 64,
  },
  radii: {
    card: 16,
    button: 8,
    input: 6,
  },
});
```

### Access Custom Tokens

```ts
import { t } from '@alf/core';

// Custom color scale
const brandColor = t.colors.brand[500];

// Custom spacing
const customSpace = t.spacing['2xl'];

// Custom radius
const cardRadius = t.radii.card;
```

---

## Responsive Utilities

```ts
import { useBreakpoint, responsive } from '@alf/core';

function MyComponent() {
  const breakpoint = useBreakpoint(); // 'phone' | 'tablet'

  const styles = {
    container: responsive({
      phone: { padding: a.space.md },
      tablet: { padding: a.space.xl, maxWidth: 768 },
    }),
    grid: responsive({
      phone: atoms.grid.cols[1],
      tablet: atoms.grid.cols[2],
    }),
  };

  return <View style={styles.container}>...</View>;
}
```

---

## Merge Utility

`merge()` composes multiple style objects. Later arguments override earlier ones. Platform-specific styles from `web()` / `native()` are filtered automatically based on the current platform.

```ts
import { merge } from '@alf/core';

const styles = merge(
  baseStyles,           // Always applied
  variantStyles,        // Override base
  web(webOnlyStyles),   // Only on web
  native(nativeOnly),   // Only on native
  conditional && overrideStyles, // Conditionally applied
);
```

### Rules

1. Deep merge for nested objects (e.g., `:hover`, `shadowOffset`)
2. Later values win for flat properties
3. `undefined` / `null` values are skipped
4. Platform guards (`web()` / `native()`) return `undefined` on wrong platform
5. Conditional values: use ternary or `&&` — falsy values are skipped

---

## Best Practices

1. **Always prefer theme atoms** (`t.*`) over static atoms (`a.*`) for user-facing UI
2. **Use `merge()`** instead of `StyleSheet.flatten()` for composing styles
3. **Wrap platform-specific code** in `web()` / `native()` — never use `Platform.OS` directly
4. **Define color tokens semantically** — never use raw hex in components
5. **Test both light and dark mode** — every component must look correct in both
6. **Use spacing tokens** (`a.space.*`) instead of hardcoded pixel values
7. **Component variants** should be driven by props, not conditional style logic
8. **Keep theme atoms flat** — avoid deeply nested token structures
9. **Use `defineTheme()` / `defineTokens()`** for custom extensions — never mutate theme objects
10. **Performance**: `merge()` is memoized — avoid creating new merge calls in render loops
