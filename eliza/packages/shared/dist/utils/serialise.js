/**
 * Creates a serialised (sequential) promise queue.
 *
 * Each call to the returned function chains the provided async `fn` after
 * the previous one completes, ensuring only one operation runs at a time.
 *
 * Usage:
 *   const run = createSerialise();
 *   await run(async () => { ... });
 */
export function createSerialise() {
    let lock = Promise.resolve();
    return (fn) => {
        const prev = lock;
        let resolve;
        lock = new Promise((r) => {
            resolve = r;
        });
        return prev.then(fn).finally(() => resolve());
    };
}
//# sourceMappingURL=serialise.js.map