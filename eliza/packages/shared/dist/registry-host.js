class DefaultUiRegistryHost {
    stores = new Map();
    getStore(key, create) {
        const existing = this.stores.get(key);
        if (existing !== undefined)
            return existing;
        const created = create();
        this.stores.set(key, created);
        return created;
    }
}
let activeRegistryHost = new DefaultUiRegistryHost();
export function provideUiRegistryHost(host) {
    activeRegistryHost = host;
}
export function getUiRegistryStore(key, create) {
    return activeRegistryHost.getStore(key, create);
}
export function resetUiRegistryHostForTests() {
    activeRegistryHost = new DefaultUiRegistryHost();
}
//# sourceMappingURL=registry-host.js.map