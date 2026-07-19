import { z } from "zod";
import type { IAgentRuntime } from "../../../../types/index.js";
import { Service } from "../../../../types/service.js";
declare const CharacterModificationSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    system: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodArray<z.ZodString>>;
    messageExamples: z.ZodOptional<z.ZodArray<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        content: z.ZodObject<{
            text: z.ZodString;
            actions: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>;
    }, z.core.$strip>>>>;
    topics: z.ZodOptional<z.ZodArray<z.ZodString>>;
    style: z.ZodOptional<z.ZodObject<{
        all: z.ZodOptional<z.ZodArray<z.ZodString>>;
        chat: z.ZodOptional<z.ZodArray<z.ZodString>>;
        post: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    settings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>>>;
}, z.core.$strip>;
type CharacterModification = z.infer<typeof CharacterModificationSchema>;
/**
 * Service for safely managing character file modifications
 * Handles backup, validation, and atomic updates of character files
 */
export declare class CharacterFileManager extends Service {
    static serviceType: "CHARACTER_MANAGEMENT";
    capabilityDescription: string;
    private characterFilePath;
    private backupDir;
    private maxBackups;
    private validationRules;
    constructor(runtime?: IAgentRuntime);
    static start(runtime: IAgentRuntime): Promise<CharacterFileManager>;
    private initialize;
    private detectCharacterFile;
    private setupValidationRules;
    createBackup(): Promise<string | null>;
    private cleanupOldBackups;
    validateModification(modification: Record<string, unknown>): {
        valid: boolean;
        errors: string[];
    };
    applyModification(modification: CharacterModification): Promise<{
        success: boolean;
        error?: string;
    }>;
    getModificationHistory(limit?: number): Promise<Array<{
        timestamp: number | undefined;
        modification: unknown;
        filePath: string | undefined;
    }>>;
    getAvailableBackups(): Promise<Array<{
        path: string;
        timestamp: number;
        size: number;
    }>>;
    restoreFromBackup(backupPath: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    restoreFromHistory(entryIndex: number): Promise<{
        success: boolean;
        error?: string;
    }>;
    stop(): Promise<void>;
}
export {};
//# sourceMappingURL=character-file-manager.d.ts.map