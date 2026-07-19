import z from "zod";
import type { Entity, Evaluator, IAgentRuntime, Memory, RegisteredEvaluator } from "../../../types/index.js";
import type { CustomMetadata } from "../../../types/memory.js";
import { type ExtractorOutput } from "./factExtractor.schema.js";
export declare const STRENGTHEN_DELTA = 0.1;
export declare const NEW_FACT_CONFIDENCE = 0.7;
export declare const DEDUP_SIMILARITY_THRESHOLD = 0.42;
declare const RelationshipOutputSchema: z.ZodObject<{
    relationships: z.ZodArray<z.ZodObject<{
        sourceEntityId: z.ZodString;
        targetEntityId: z.ZodString;
        tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const IdentityOutputSchema: z.ZodObject<{
    identities: z.ZodArray<z.ZodObject<{
        entityId: z.ZodString;
        platform: z.ZodString;
        handle: z.ZodString;
        confidence: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const SuccessOutputSchema: z.ZodObject<{
    completed: z.ZodBoolean;
    reason: z.ZodString;
    thought: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type SuccessOutput = z.infer<typeof SuccessOutputSchema>;
interface ReflectionPrepared {
    recentMessages: Memory[];
    entities: Entity[];
    existingRelationships: Awaited<ReturnType<IAgentRuntime["getRelationships"]>>;
}
interface FactPrepared extends ReflectionPrepared {
    knownFacts: Memory[];
}
interface SuccessPrepared extends ReflectionPrepared {
    actionResults: unknown[];
}
export declare function formatRecentMessages(memories: Memory[]): string;
export declare const REFLECTION_ENTITY_LIMIT = 50;
export declare function preserveFactMetadata(fact: Memory): CustomMetadata;
export declare function canEvaluateMessage(message: Memory): boolean;
export declare const factMemoryEvaluator: Evaluator<ExtractorOutput, FactPrepared>;
export declare const relationshipEvaluator: Evaluator<z.infer<typeof RelationshipOutputSchema>, ReflectionPrepared>;
export declare const identityEvaluator: Evaluator<z.infer<typeof IdentityOutputSchema>, ReflectionPrepared>;
export declare const successEvaluator: Evaluator<SuccessOutput, SuccessPrepared>;
export declare const reflectionItems: RegisteredEvaluator[];
export {};
//# sourceMappingURL=reflection-items.d.ts.map