/** The slice of node-postgres' Pool that Kysely's PostgresDialect and our `Sql` wrapper use. */
export interface PoolClientLike {
  query(text: string, params?: unknown[]): Promise<{ rows: unknown[]; rowCount?: number | null; command?: string }>;
  release(): void;
}

export interface PoolLike {
  connect(): Promise<PoolClientLike>;
  end(): Promise<void>;
}
