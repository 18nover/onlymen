/**
 * Generic union-find (disjoint-set) data structure.
 *
 * Used to compute connected components from pairwise edges. The relationships
 * graph builds identity clusters (members of the same person across platforms)
 * by unioning entities that share a confirmed identity link or a normalized
 * cross-platform handle. Both the runtime-level
 * `agent/src/services/relationships-graph.ts` clusterer and the
 * service-level `RelationshipsService` cluster lookup share this structure
 * to guarantee the same notion of cluster membership.
 *
 * Path compression on find() keeps amortised cost near O(α(n)).
 */
export declare class UnionFind<T> {
    private readonly parent;
    constructor(initial?: Iterable<T>);
    /** Idempotently register a node so it has a parent pointer. */
    add(value: T): void;
    /** True if the value is known to the structure. */
    has(value: T): boolean;
    /** Find the canonical root of `value`. Adds the node lazily. */
    find(value: T): T;
    /** Merge the components containing `left` and `right`. */
    union(left: T, right: T): void;
    /** Return all components as arrays of members keyed by root. */
    groups(): Map<T, T[]>;
    /** Return the members of the component containing `value`. */
    componentOf(value: T): T[];
}
//# sourceMappingURL=union-find.d.ts.map