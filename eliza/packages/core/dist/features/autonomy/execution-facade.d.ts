/**
 * Execution facade for autonomy: runs the same post-LLM steps as the message
 * pipeline (planned tool execution, memory creation, evaluators) given batcher
 * result fields and a synthetic autonomy message.
 *
 * WHY: The batcher delivers the Reason phase output; we must run Run actions +
 * Evaluate without duplicating message.ts. One facade keeps schema and semantics
 * aligned and gives a single place to change post-LLM behavior.
 */
import type { HandlerCallback, IAgentRuntime, Memory } from "../../types/index.js";
/**
 * Run the same post-LLM steps as the message pipeline for an autonomy response:
 * build response content and messages, save to memory, execute planned tools,
 * run evaluators. Call this from the autonomy batcher section's onResult.
 *
 * @param runtime - Agent runtime
 * @param autonomousMessage - Synthetic message representing the autonomy prompt (entityId = autonomy entity, roomId = autonomous room, content.metadata isAutonomous etc.)
 * @param fields - Batcher result fields (thought, actions, text, simple, etc.; namespace already stripped)
 * @param callback - Optional handler callback (e.g. for logging or downstream consumers)
 */
export declare function runAutonomyPostResponse(runtime: IAgentRuntime, autonomousMessage: Memory, fields: Record<string, unknown>, callback?: HandlerCallback): Promise<void>;
//# sourceMappingURL=execution-facade.d.ts.map