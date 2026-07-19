/**
 * Canonical hardware product catalog.
 *
 * Single source of truth for hardware SKUs, copy, pricing, and color options
 * shared across:
 *   - `@elizaos/os-homepage` (marketing site product tiles + checkout)
 *   - `@elizaos/app` (signed-in checkout page)
 *   - `@elizaos/cloud-api` (Stripe checkout-session creation)
 *
 * Adding a product here automatically:
 *   - Adds a tile to both checkout flows
 *   - Adds the SKU to the cloud-api Zod enum and Stripe line-item builder
 *
 * Do NOT add Stripe price IDs here unless we move to a managed-price model;
 * cloud-api currently builds `price_data` inline from `priceUsd`.
 */
export type ProductKind = "phone" | "box" | "usb" | "chibi" | "mini";
export type ProductColor = {
    /** Stable per-product color id, e.g. "usb-orange". */
    id: string;
    /** Human-readable color name, e.g. "Orange". Used as the Stripe metadata value. */
    name: string;
};
export type Product = {
    /** URL slug for product landing pages (`/hardware/<slug>`). */
    slug: string;
    /** Stable SKU. Sent to Stripe metadata and used everywhere as the lookup key. */
    sku: string;
    /** Display name. */
    name: string;
    /** Display price (e.g. "$49" or "$499 deposit"). */
    price: string;
    /** Stripe unit amount in USD (integer dollars). */
    priceUsd: number;
    /** Optional shipping copy (e.g. "Ships October 2026" or "Pre-order"). */
    ships?: string;
    /** Path under `/brand/concepts/` (already synced into each app's `public/`). */
    image: string;
    /** Alt text for the product image. */
    imageAlt: string;
    /** Short marketing summary (one sentence). */
    summary: string;
    /** Longer marketing detail (one sentence). */
    detail: string;
    /** Short subtitle used by the cloud checkout panel. */
    subtitle: string;
    /** UI hint used by the cloud checkout to pick an icon and visual layout. */
    kind: ProductKind;
    /** Selectable colors. */
    colors: ProductColor[];
    /** Stripe line-item product name. */
    stripeName: string;
    /** Stripe line-item product description. */
    stripeDescription: string;
};
export declare const HARDWARE_PRODUCTS: readonly [{
    readonly slug: "usb";
    readonly sku: "elizaos-usb";
    readonly name: "ElizaOS USB";
    readonly price: "$49";
    readonly priceUsd: 49;
    readonly ships: "Ships October 2026";
    readonly image: "/brand/concepts/concept_usbdrive_900.jpg";
    readonly imageAlt: "Blue ElizaOS USB drive concept";
    readonly summary: "Boot elizaOS from your pocket.";
    readonly detail: "Live image on a stick. Plug into any UEFI PC and run.";
    readonly subtitle: "Simple branded USB installer. Ships October 2026.";
    readonly kind: "usb";
    readonly colors: ProductColor[];
    readonly stripeName: "ElizaOS USB key preorder";
    readonly stripeDescription: "First-party ElizaOS USB installer key. Ships October 2026.";
}, {
    readonly slug: "usb-plastic";
    readonly sku: "elizaos-usb-plastic";
    readonly name: "Branded USB key";
    readonly price: "$49";
    readonly priceUsd: 49;
    readonly ships: "Ships October 2026";
    readonly image: "/brand/concepts/concept_usbdrive_900.jpg";
    readonly imageAlt: "Branded ElizaOS plastic USB key concept";
    readonly summary: "Plastic USB installer in ElizaOS branding.";
    readonly detail: "Simple plastic USB key with the ElizaOS live installer.";
    readonly subtitle: "Simple plastic USB installer. Ships October 2026.";
    readonly kind: "usb";
    readonly colors: ProductColor[];
    readonly stripeName: "Branded USB key preorder";
    readonly stripeDescription: "Simple plastic ElizaOS USB installer key. Ships October 2026.";
}, {
    readonly slug: "chibi-usb";
    readonly sku: "elizaos-usb-chibi";
    readonly name: "Chibi USB key";
    readonly price: "$49";
    readonly priceUsd: 49;
    readonly ships: "Ships October 2026";
    readonly image: "/brand/concepts/chibi_usb_concept_900.jpg";
    readonly imageAlt: "Chibi ElizaOS USB key concept";
    readonly summary: "Same boot key. Smaller mascot shell.";
    readonly detail: "ElizaOS USB in a collector enclosure.";
    readonly subtitle: "Character USB installer. Ships October 2026.";
    readonly kind: "chibi";
    readonly colors: [{
        readonly id: "chibi-orange";
        readonly name: "Orange";
    }];
    readonly stripeName: "Chibi USB key preorder";
    readonly stripeDescription: "Character ElizaOS USB installer key. Ships October 2026.";
}, {
    readonly slug: "case";
    readonly sku: "elizaos-raspberry-pi-case";
    readonly name: "Raspberry Pi case";
    readonly price: "$49";
    readonly priceUsd: 49;
    readonly ships: "Ships October 2026";
    readonly image: "/brand/concepts/billboard_concept_1200.jpg";
    readonly imageAlt: "ElizaOS Raspberry Pi case concept";
    readonly summary: "A shell for a local agent.";
    readonly detail: "Bring your own Pi. We ship the enclosure.";
    readonly subtitle: "ElizaOS case for a local agent board.";
    readonly kind: "box";
    readonly colors: ProductColor[];
    readonly stripeName: "ElizaOS Raspberry Pi case preorder";
    readonly stripeDescription: "Reserve the ElizaOS Raspberry Pi case.";
}, {
    readonly slug: "raspberry-pi";
    readonly sku: "elizaos-custom-raspberry-pi-case";
    readonly name: "Custom Raspberry Pi + case";
    readonly price: "$149";
    readonly priceUsd: 149;
    readonly ships: "Ships October 2026";
    readonly image: "/brand/concepts/billboard_concept_1200.jpg";
    readonly imageAlt: "ElizaOS Raspberry Pi kit concept";
    readonly summary: "Plug in, boot, run local.";
    readonly detail: "Pi, case, SD card pre-imaged. One box, one cable.";
    readonly subtitle: "Custom Pi kit in the ElizaOS case.";
    readonly kind: "box";
    readonly colors: ProductColor[];
    readonly stripeName: "ElizaOS Raspberry Pi + case preorder";
    readonly stripeDescription: "Reserve the custom Raspberry Pi and ElizaOS case kit.";
}, {
    readonly slug: "mini-pc";
    readonly sku: "elizaos-mini-pc";
    readonly name: "ElizaOS mini PC";
    readonly price: "$1999";
    readonly priceUsd: 1999;
    readonly ships: "Ships October 2026";
    readonly image: "/brand/concepts/concept_minipc_900.jpg";
    readonly imageAlt: "ElizaOS mini PC concept";
    readonly summary: "Always-on compute for agents.";
    readonly detail: "Desktop-class inference at home. Quiet, owned, yours.";
    readonly subtitle: "Always-on local compute for agents.";
    readonly kind: "mini";
    readonly colors: ProductColor[];
    readonly stripeName: "ElizaOS mini PC preorder";
    readonly stripeDescription: "Reserve the first-party ElizaOS mini PC.";
}, {
    readonly slug: "phone";
    readonly sku: "elizaos-phone";
    readonly name: "ElizaOS Phone";
    readonly price: "$499 deposit";
    readonly priceUsd: 499;
    readonly ships: "Pre-order";
    readonly image: "/brand/concepts/concept_phone_800.jpg";
    readonly imageAlt: "Eliza Phone concept";
    readonly summary: "The runtime in your hand.";
    readonly detail: "AOSP build with elizaOS as the shell.";
    readonly subtitle: "Reserve first-party phone hardware.";
    readonly kind: "phone";
    readonly colors: [{
        readonly id: "phone-orange";
        readonly name: "Orange";
    }, {
        readonly id: "phone-blue-frame";
        readonly name: "Blue";
    }, {
        readonly id: "phone-white";
        readonly name: "White";
    }, {
        readonly id: "phone-blue-glass";
        readonly name: "Blue glass";
    }];
    readonly stripeName: "ElizaOS Phone preorder deposit";
    readonly stripeDescription: "Reserve first-party ElizaOS phone hardware.";
}, {
    readonly slug: "box";
    readonly sku: "elizaos-box";
    readonly name: "ElizaOS Box";
    readonly price: "$299 deposit";
    readonly priceUsd: 299;
    readonly ships: "Pre-order";
    readonly image: "/brand/concepts/billboard_concept_1200.jpg";
    readonly imageAlt: "ElizaOS box hardware concept";
    readonly summary: "A household agent appliance.";
    readonly detail: "Sits on the shelf. Runs the home.";
    readonly subtitle: "Reserve the ElizaOS home/runtime box.";
    readonly kind: "box";
    readonly colors: ProductColor[];
    readonly stripeName: "ElizaOS Box preorder deposit";
    readonly stripeDescription: "Reserve the ElizaOS home/runtime box.";
}];
export type HardwareSku = (typeof HARDWARE_PRODUCTS)[number]["sku"];
export declare const HARDWARE_SKUS: [HardwareSku, ...HardwareSku[]];
export declare function findBySku(sku: string): Product | undefined;
export declare function findBySlug(slug: string): Product | undefined;
//# sourceMappingURL=index.d.ts.map