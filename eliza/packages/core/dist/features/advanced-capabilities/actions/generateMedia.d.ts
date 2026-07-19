/**
 * GENERATE_MEDIA action: turns a prompt into an image, video, or audio (music,
 * sfx, or tts) attachment. Routes the request through the runtime's
 * MEDIA_GENERATION service, falling back to the IMAGE model when only image
 * generation is available and no service is configured. The result is delivered
 * as an attachment-only callback (the planner/evaluator composes the
 * user-facing text). Media kind comes from the structured `mediaType` /
 * `audioKind` enums the planner emits, never from natural-language keywords
 * (#10471).
 */
import type { Action } from "../../../types/index.js";
export declare const generateMediaAction: Action;
//# sourceMappingURL=generateMedia.d.ts.map