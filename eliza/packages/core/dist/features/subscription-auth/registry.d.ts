/**
 * Registry for {@link SubscriptionAuthProvider} descriptors.
 *
 * Model-provider plugins (or host built-ins) register their vendor's
 * subscription product here; the host `auth/` layer drains it generically.
 * Registration is idempotent per id (last registration wins) so a plugin can
 * override a host built-in without an ordering constraint.
 *
 * @module features/subscription-auth
 */
import type { SubscriptionAuthProvider } from "./types.js";
/**
 * Register (or replace) the subscription-auth descriptor for a vendor id.
 * Idempotent: re-registering the same id overwrites the prior descriptor.
 */
export declare function registerSubscriptionAuthProvider(provider: SubscriptionAuthProvider): void;
/** Look up the registered descriptor for a vendor id, or `undefined`. */
export declare function getSubscriptionAuthProvider(id: string): SubscriptionAuthProvider | undefined;
/** All registered descriptors, in registration order. */
export declare function listSubscriptionAuthProviders(): SubscriptionAuthProvider[];
/** True when a descriptor is registered for the vendor id. */
export declare function hasSubscriptionAuthProvider(id: string): boolean;
/**
 * Remove all registered descriptors. Test-only — lets a suite start from a
 * clean registry without reloading the module.
 */
export declare function resetSubscriptionAuthProviders(): void;
//# sourceMappingURL=registry.d.ts.map