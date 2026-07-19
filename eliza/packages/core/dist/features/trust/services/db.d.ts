/**
 * Resolves the runtime's Drizzle database handle for the trust capability's
 * data-access layer and defines the minimal chainable `DrizzleDB` shape those
 * queries use. `getDb` throws when no adapter is attached; consumed by
 * SecurityStore, TrustEngine, and SecurityModule.
 */
import type { IAgentRuntime } from "../../../types/index.js";
/**
 * Minimal Drizzle-compatible DB interface.
 * Uses a chainable query builder pattern matching drizzle-orm.
 */
export type DrizzleDB = Record<string, (...args: unknown[]) => any>;
/**
 * Get the Drizzle database instance from the runtime.
 * @throws if the database is unavailable.
 */
export declare function getDb(runtime: IAgentRuntime): DrizzleDB;
//# sourceMappingURL=db.d.ts.map