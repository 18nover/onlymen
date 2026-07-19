/**
 * Fixed roster of gender-neutral placeholder display names for seeding examples
 * and synthetic entities, plus pickRandomExampleName for a random pick (with a
 * `user<n>` fallback). The ordered `as const` list keeps seeded consumers
 * (deterministic.ts) reproducible across runs.
 */
export declare const EXAMPLE_NAMES: readonly ["Avery", "Blake", "Casey", "Cleo", "Drew", "Emery", "Finley", "Harper", "Indigo", "Jules", "Kai", "Lane", "Logan", "Morgan", "Nova", "Parker", "Quinn", "Reese", "River", "Rowan", "Sage", "Skyler", "Taylor", "Wren"];
export declare function pickRandomExampleName(index?: number): string;
//# sourceMappingURL=example-names.d.ts.map