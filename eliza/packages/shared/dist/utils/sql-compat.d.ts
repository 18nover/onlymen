/**
 * SQL identifier-quoting/sanitizing helpers plus per-runtime schema-repair
 * bookkeeping. The `WeakSet`/`WeakMap` keyed by `AgentRuntime` make repair
 * idempotent and race-safe (one in-flight repair promise shared per runtime).
 */
import type { AgentRuntime } from "@elizaos/core";
export declare function quoteIdent(name: string): string;
export declare function sanitizeIdentifier(value: string | null | undefined): string | null;
export declare function sqlLiteral(value: string): string;
export declare function executeRawSql(runtime: AgentRuntime, sqlText: string): Promise<{
    rows: Record<string, unknown>[];
    columns: string[];
}>;
export declare function ensureRuntimeSqlCompatibility(runtime: AgentRuntime | null | undefined): Promise<void>;
//# sourceMappingURL=sql-compat.d.ts.map