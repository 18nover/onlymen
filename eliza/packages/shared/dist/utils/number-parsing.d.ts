/**
 * Numeric parsing helpers with optional fallback, flooring, and min/max clamping
 * for positive integers/floats. Used to coerce env vars and config values into
 * bounded numbers without scattering ad-hoc `Number()` + guard logic.
 */
export interface ParsePositiveNumberOptions {
    fallback?: number;
    floor?: boolean;
}
export interface ParseClampedNumberOptions {
    min?: number;
    max?: number;
    fallback?: number;
}
export interface ParseClampedIntegerOptions {
    min?: number;
    max?: number;
    fallback?: number;
}
export declare function parsePositiveInteger(value: string | null | undefined, fallback: number): number;
export declare function parsePositiveInteger(value: string | null | undefined, fallback?: number): number | undefined;
export declare function parsePositiveFloat(value: string | null | undefined, options?: ParsePositiveNumberOptions): number | undefined;
export declare function parseClampedFloat(value: string | null | undefined, options: ParseClampedNumberOptions & {
    fallback: number;
}): number;
export declare function parseClampedFloat(value: string | null | undefined, options?: ParseClampedNumberOptions): number | undefined;
export declare function parseClampedInteger(value: string | null | undefined, options: ParseClampedIntegerOptions & {
    fallback: number;
}): number;
export declare function parseClampedInteger(value: string | null | undefined, options?: ParseClampedIntegerOptions): number | undefined;
//# sourceMappingURL=number-parsing.d.ts.map