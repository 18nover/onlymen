import type { Provider } from "../../../types/index.js";
/**
 * Function to get key facts that the agent knows about the speaker.
 * Splits retrieval into room/entity candidate pools, performs local BM25
 * keyword scoring over fact text + extracted keywords, and ranks each kind
 * with its own time-weighting curve.
 */
declare const factsProvider: Provider;
export { factsProvider };
//# sourceMappingURL=facts.d.ts.map