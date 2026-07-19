/**
 * KMS client types and error classes shared by every backend implementation.
 */
export class KmsError extends Error {
    /**
     * HTTP status from the KMS backend when the failure was an HTTP response
     * (e.g. Steward). Lets callers distinguish key-not-found (404) from
     * transport/server breakage without parsing the message.
     */
    status;
    constructor(message, status) {
        super(message);
        this.name = "KmsError";
        if (status !== undefined)
            this.status = status;
    }
}
export class KeyNotFoundError extends KmsError {
    constructor(keyId, version) {
        super(version !== undefined
            ? `key not found: ${keyId} v${version}`
            : `key not found: ${keyId}`);
        this.name = "KeyNotFoundError";
    }
}
export class NotImplementedError extends KmsError {
    constructor(what) {
        super(`unsupported KMS operation: ${what}`);
        this.name = "NotImplementedError";
    }
}
//# sourceMappingURL=types.js.map