/**
 * TUNNEL_CREDENTIAL_TO_CHILD_SESSION — atomic action.
 *
 * Once the parent has collected the credential value from the owner (via the
 * sensitive-request flow that was dispatched by
 * `DECLARE_SUB_AGENT_CREDENTIAL_SCOPE`), this action hands the plaintext
 * value to the credential bridge, which encrypts it under the scope's
 * symmetric key and stores the ciphertext for one-shot retrieval by the
 * child.
 *
 * The plaintext credential value is NEVER logged. The action's `data`
 * response only contains the scope id and key name.
 */
import type { Action } from "../../../types/index.js";
export declare const tunnelCredentialToChildSessionAction: Action;
//# sourceMappingURL=tunnel-credential-to-child-session.d.ts.map