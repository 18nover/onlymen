/**
 * Entity types for the knowledge graph (canonical, runtime-level).
 *
 * An Entity is a node — a person, organization, place, project, or concept —
 * with per-connector identities and open-keyed extracted attributes. The user
 * is the special `self` Entity.
 *
 * Canonical home: `@elizaos/shared`. The DB-backed `EntityStore` lives in
 * `@elizaos/plugin-personal-assistant`; the `LifeOpsEntity` wire contract in
 * `@elizaos/shared/contracts/personal-assistant` re-exports these shapes.
 */
/**
 * Built-in entity types. The registry accepts any string, but these are the
 * shapes the runtime understands without registration. Open string with
 * registered metadata via {@link EntityTypeRegistry}.
 */
export const BUILT_IN_ENTITY_TYPES = [
    "person",
    "organization",
    "place",
    "project",
    "concept",
];
/**
 * The identifier of the `self` Entity. Bootstrapped on first store init.
 * All ego-network edges originate from `self`.
 */
export const SELF_ENTITY_ID = "self";
/**
 * Open-string registry of entity types. Built-ins always validate; new types
 * are registered with optional metadata (display label, default visibility).
 *
 * Registration is idempotent (re-registering the same key with the same
 * metadata is a no-op). Conflicting metadata throws.
 */
export class EntityTypeRegistry {
    registered = new Map();
    constructor() {
        for (const type of BUILT_IN_ENTITY_TYPES) {
            this.registered.set(type, {
                label: type,
                defaultVisibility: "owner_agent_admin",
            });
        }
    }
    register(type, metadata = {}) {
        const next = {
            label: metadata.label ?? type,
            defaultVisibility: metadata.defaultVisibility ?? "owner_agent_admin",
        };
        const existing = this.registered.get(type);
        if (existing) {
            if (existing.label !== next.label ||
                existing.defaultVisibility !== next.defaultVisibility) {
                throw new Error(`[EntityTypeRegistry] type "${type}" already registered with different metadata`);
            }
            return;
        }
        this.registered.set(type, next);
    }
    has(type) {
        return this.registered.has(type);
    }
    list() {
        return Array.from(this.registered.keys()).sort();
    }
    metadataFor(type) {
        return this.registered.get(type) ?? null;
    }
}
/**
 * Shared default registry instance. Tests construct their own.
 */
export const defaultEntityTypeRegistry = new EntityTypeRegistry();
//# sourceMappingURL=entity-types.js.map