# Coding Standards

## TypeScript

- **Strict mode** — `strict: true` always. No exceptions.
- **No `any`** — Use `unknown` and narrow with type guards.
- **No type assertions** (`as`) unless documented with `// justification: ...`.
- **Discriminated unions** over optional properties for variant types.
- **Branded types** for IDs: `type PostId = string & { __brand: 'PostId' }`.
- **Const assertions** for literal type inference: `as const`.

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Variables/functions | camelCase | `getUserProfile` |
| Components | PascalCase | `UserProfileScreen` |
| Types/interfaces | PascalCase | `BlueSkyPost` |
| Constants | SCREAMING_SNAKE | `MAX_POST_LENGTH` |
| Files (components) | PascalCase | `UserProfile.tsx` |
| Files (utilities) | camelCase | `formatDate.ts` |
| Files (types) | camelCase | `types.ts` or `index.ts` |
| CSS/ALF atoms | camelCase | `a.flex_row` |

## React Native + Expo

- **Functional components only** — No class components.
- **React Compiler enabled** — No manual `useMemo`/`useCallback`.
- **Platform-specific files** — Use `.web.tsx`, `.native.tsx` extensions.
- **Import alias** — Use `#/` for internal imports: `import { x } from '#/utils'`.
- **ALF design system** — Use `a.*` atoms and `t.atoms.*` for styling.
- **No inline styles** — Use ALF atoms or StyleSheet.create.
- **TanStack Query** — Server state via queries, not local state.
- **Lingui** — All user-facing strings via `l` macro or `<Trans>`.

## Error Handling

- **Fail fast** — Throw typed errors, don't catch-and-continue.
- **ElizaError** — Use `ElizaError` from `@elizaos/core` for structured errors.
- **No empty catches** — Every catch must handle, rethrow, or annotate with `// error-policy:J<N>`.
- **No fabricated defaults** — `?? 0` or `?? []` from a catch is forbidden.
- **Runtime boundaries** — Only catch at process/transport boundaries (J1).

## File Organization

```
src/
├── components/       Shared UI components
├── features/         Feature modules (co-located)
│   └── feature-name/
│       ├── index.ts
│       ├── Component.tsx
│       ├── hooks.ts
│       ├── types.ts
│       └── __tests__/
├── screens/          Top-level screens
├── services/         API clients, external services
├── utils/            Pure utility functions
├── hooks/            Shared React hooks
└── types/            Shared TypeScript types
```

## Comments

- **Header** — One `/** ... */` prose block at file top. States purpose, not filename.
- **Why, not what** — Comments explain rationale, constraints, non-obvious consequences.
- **No change narration** — History lives in git.
- **No commented-out code** — Delete it. Git remembers.
- **JSDoc on exports** — For callers. Implementation notes inline with `//`.

## Testing

- **Vitest** — Unit and integration tests.
- **Co-located tests** — `__tests__/` or `*.test.ts` next to source.
- **No mocks for external services** — Use real services in integration tests.
- **Edge cases** — Test null, empty, boundary values, errors.
- **Accessibility tests** — Screen reader compatibility for UI components.
