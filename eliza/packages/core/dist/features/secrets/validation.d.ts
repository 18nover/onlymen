/**
 * Secret Validation Module
 *
 * Provides validation strategies for different types of secrets
 * including API keys, URLs, and custom validation.
 */
import type { CustomValidator, ValidationResult, ValidationStrategy } from "./types.js";
/**
 * Validation strategy implementations
 */
export declare const ValidationStrategies: Record<string, CustomValidator>;
/**
 * Register a custom validator
 */
export declare function registerValidator(name: string, validator: CustomValidator): void;
/**
 * Unregister a custom validator
 */
export declare function unregisterValidator(name: string): boolean;
/**
 * Get a validator by strategy name
 */
export declare function getValidator(strategy: string): CustomValidator | undefined;
/**
 * Validate a secret value
 */
export declare function validateSecret(key: string, value: string, strategy?: string): Promise<ValidationResult>;
/**
 * Infer validation strategy from secret key name
 */
export declare function inferValidationStrategy(key: string): ValidationStrategy;
export { validateSecret as validate };
//# sourceMappingURL=validation.d.ts.map