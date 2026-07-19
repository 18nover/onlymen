/**
 * Provider for the trust capability that marks the current speaker as a trusted
 * admin when they are the world OWNER, injecting a directive that their
 * contact/identity claims may be treated as trusted absent contradictory
 * evidence. Resolves the owner from the room's world `metadata.ownership`/`roles`
 * and is gated to admin/settings contexts and a minimum ADMIN role.
 */
import type { Provider } from "../../../types/index.js";
export declare const adminTrustProvider: Provider;
//# sourceMappingURL=adminTrust.d.ts.map