/**
 * Relationship types for the knowledge graph (canonical, runtime-level).
 *
 * A Relationship is a typed edge between two Entities, carrying its own
 * metadata (cadence, role, sentiment) and state (last-interaction, count,
 * sentiment trend). Each edge has its own provenance trail.
 *
 * Canonical home: `@elizaos/shared`. The DB-backed `RelationshipStore` lives in
 * `@elizaos/plugin-personal-assistant`; the `LifeOpsGraphRelationship` wire
 * contract in `@elizaos/shared/contracts/personal-assistant` re-exports these
 * shapes.
 */
/**
 * Built-in relationship types. The registry accepts any string, but these
 * are the shapes the planner / followup-watcher / extraction know about
 * without registration.
 */
export const BUILT_IN_RELATIONSHIP_TYPES = [
    "follows",
    "colleague_of",
    "friend_of",
    "family_of",
    "partner_of",
    "ex_partner_of",
    "co_parent_of",
    "manages",
    "managed_by",
    "lives_at",
    "works_at",
    "knows",
    "owns",
];
/**
 * Open-string registry for relationship types. Built-ins always validate;
 * new types may register typed metadata schemas via {@link metadataKeys}.
 * The runtime does not branch on type — the registry is informational.
 */
export class RelationshipTypeRegistry {
    registered = new Map();
    constructor() {
        // Built-ins with their canonical metadata shapes.
        this.registered.set("follows", {
            label: "follows",
            metadataKeys: ["cadenceDays"],
            symmetric: false,
        });
        this.registered.set("colleague_of", {
            label: "colleague of",
            metadataKeys: ["since", "team"],
            symmetric: true,
        });
        this.registered.set("friend_of", {
            label: "friend of",
            metadataKeys: ["since", "cadenceDays"],
            symmetric: true,
        });
        this.registered.set("family_of", {
            label: "family of",
            metadataKeys: ["role", "since", "cadenceDays"],
            symmetric: true,
        });
        this.registered.set("partner_of", {
            label: "partner of",
            metadataKeys: ["since"],
            symmetric: true,
        });
        this.registered.set("ex_partner_of", {
            label: "ex-partner of",
            metadataKeys: ["since", "endedAt"],
            symmetric: true,
        });
        this.registered.set("co_parent_of", {
            label: "co-parent of",
            metadataKeys: ["childId", "cadenceDays", "since"],
            symmetric: true,
        });
        this.registered.set("manages", {
            label: "manages",
            metadataKeys: ["since"],
            symmetric: false,
        });
        this.registered.set("managed_by", {
            label: "managed by",
            metadataKeys: ["since"],
            symmetric: false,
        });
        this.registered.set("lives_at", {
            label: "lives at",
            metadataKeys: ["since"],
            symmetric: false,
        });
        this.registered.set("works_at", {
            label: "works at",
            metadataKeys: ["role", "since"],
            symmetric: false,
        });
        this.registered.set("knows", {
            label: "knows",
            metadataKeys: [],
            symmetric: true,
        });
        this.registered.set("owns", {
            label: "owns",
            metadataKeys: ["since"],
            symmetric: false,
        });
    }
    register(type, metadata = {}) {
        const next = {
            label: metadata.label ?? type,
            metadataKeys: metadata.metadataKeys ?? [],
            symmetric: metadata.symmetric ?? false,
        };
        const existing = this.registered.get(type);
        if (existing) {
            const sameKeys = existing.metadataKeys.length === next.metadataKeys.length &&
                existing.metadataKeys.every((key, idx) => key === next.metadataKeys[idx]);
            if (existing.label !== next.label ||
                existing.symmetric !== next.symmetric ||
                !sameKeys) {
                throw new Error(`[RelationshipTypeRegistry] type "${type}" already registered with different metadata`);
            }
            return;
        }
        this.registered.set(type, next);
    }
    has(type) {
        return this.registered.has(type);
    }
    isSymmetric(type) {
        return this.registered.get(type)?.symmetric ?? false;
    }
    list() {
        return Array.from(this.registered.keys()).sort();
    }
}
export const defaultRelationshipTypeRegistry = new RelationshipTypeRegistry();
//# sourceMappingURL=relationship-types.js.map