/**
 * `ScoreCard`: in-memory aggregation of DPE `ScoreSignal`s into a single weighted
 * `composite` for one trace row. Single-path ingest (`addAll` delegates to `add`)
 * avoids drift; malformed (NaN) signals are dropped at aggregate time so one bad
 * plugin signal cannot poison a score. Pairs with `prompt-optimization-trace`.
 */
import { type ScoreCardData, type ScoreSignal } from "./prompt-optimization-trace.js";
/**
 * In-memory aggregation of `ScoreSignal`s into a weighted `composite` for one trace row.
 *
 * **Why `addAll` calls `add`:** one validation path (truthy signal + numeric `value`) avoids
 * drift between single and batch ingest. **Why `composite` skips NaN:** malformed signals from
 * plugins should not poison the whole score; they are dropped at aggregate time.
 */
export declare class ScoreCard {
    private _signals;
    private _weightOverrides?;
    constructor(weightOverrides?: Record<string, number>);
    add(signal: ScoreSignal): void;
    addAll(signals: ScoreSignal[]): void;
    get signals(): readonly ScoreSignal[];
    bySource(source: string): ScoreSignal[];
    byKind(kind: string): ScoreSignal[];
    composite(weightOverrides?: Record<string, number>): number;
    toJSON(): ScoreCardData;
    static fromJSON(data: ScoreCardData, weightOverrides?: Record<string, number>): ScoreCard;
}
//# sourceMappingURL=prompt-optimization-score-card.d.ts.map