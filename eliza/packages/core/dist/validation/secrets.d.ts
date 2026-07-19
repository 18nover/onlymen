/**
 * Secret Validation Module
 *
 * Consolidated validation patterns for secrets across the entire codebase.
 * All secret validation should use these patterns to ensure consistency.
 *
 * @module validation/secrets
 */
/**
 * Validation pattern definition
 */
export interface SecretValidationPattern {
    /** Regular expression to validate the secret format */
    pattern: RegExp;
    /** Human-readable description of the expected format */
    description: string;
    /** Minimum length requirement */
    minLength?: number;
    /** Maximum length requirement */
    maxLength?: number;
    /** Example of a valid format (redacted/fake) */
    example?: string;
}
/**
 * Consolidated validation patterns for all secret types.
 * These patterns validate the format of secrets without making API calls.
 */
export declare const SECRET_VALIDATION_PATTERNS: Record<string, SecretValidationPattern>;
/**
 * Result of a secret validation
 */
export interface SecretValidationResult {
    /** Whether the secret is valid */
    isValid: boolean;
    /** Error message if invalid */
    error?: string;
    /** Warning message (valid but with caveats) */
    warning?: string;
    /** Additional details */
    details?: string;
    /** Timestamp of validation */
    validatedAt: number;
}
/**
 * Validate a secret key/value pair.
 *
 * @param key - The secret key name
 * @param value - The secret value to validate
 * @returns Validation result
 */
export declare function validateSecretKey(key: string, value: string): SecretValidationResult;
/**
 * Validate multiple secrets at once.
 *
 * @param secrets - Record of key-value pairs to validate
 * @returns Record of validation results
 */
export declare function validateSecrets(secrets: Record<string, string>): Record<string, SecretValidationResult>;
/**
 * Check if all required secrets are present and valid.
 *
 * @param secrets - Record of secrets to check
 * @param requiredKeys - Array of required key names
 * @returns Object with missing and invalid keys
 */
export declare function checkRequiredSecrets(secrets: Record<string, string>, requiredKeys: string[]): {
    valid: boolean;
    missing: string[];
    invalid: string[];
    results: Record<string, SecretValidationResult>;
};
/**
 * Get the validation pattern for a secret key.
 *
 * @param key - The secret key name
 * @returns The validation pattern, or undefined if none exists
 */
export declare function getValidationPattern(key: string): SecretValidationPattern | undefined;
/**
 * Check if a key has a specific validation pattern.
 *
 * @param key - The secret key name
 * @returns true if a pattern exists for this key
 */
export declare function hasValidationPattern(key: string): boolean;
/**
 * Infer the validation pattern key from a secret key name.
 * Useful for keys that might have slight variations.
 *
 * @param key - The secret key name
 * @returns The inferred pattern key, or the original key
 */
export declare function inferValidationPatternKey(key: string): string;
//# sourceMappingURL=secrets.d.ts.map