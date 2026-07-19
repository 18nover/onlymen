/**
 * Zod schema and validators for character/agent definitions — the runtime
 * boundary that decides whether raw config (a JSON file, env, or an in-process
 * object) is accepted as a `Character` (`types/agent`). Exports `characterSchema`
 * plus its sub-schemas (media, content, message examples, style, settings,
 * secrets) and the `validateCharacter` / `parseAndValidateCharacter` /
 * `isValidCharacter` entry points.
 *
 * The top-level object is `.strict()` (unknown top-level keys are rejected) while
 * `content` and `settings` `.passthrough()`; unknown `settings` keys are folded
 * into `extra`. `knowledge` is a back-compat alias — the transform uses it to
 * populate `documents` only when `documents` is empty. `templates` accept a
 * string or a `({ state }) => string` callback, but callbacks survive only from
 * in-process character objects; JSON-loaded characters carry strings.
 */
import z from "zod";
import type { Character, TemplateType } from "../types/agent.js";
import type { JsonValue } from "../types/primitives.js";
export declare const uuidSchema: z.ZodString;
export declare const mediaSchema: z.ZodObject<{
    id: z.ZodString;
    url: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    text: z.ZodOptional<z.ZodString>;
    contentType: z.ZodOptional<z.ZodEnum<{
        readonly IMAGE: "image";
        readonly VIDEO: "video";
        readonly AUDIO: "audio";
        readonly DOCUMENT: "document";
        readonly LINK: "link";
    }>>;
}, z.core.$loose>;
export declare const contentSchema: z.ZodObject<{
    text: z.ZodOptional<z.ZodString>;
    thought: z.ZodOptional<z.ZodString>;
    actions: z.ZodOptional<z.ZodArray<z.ZodString>>;
    providers: z.ZodOptional<z.ZodArray<z.ZodString>>;
    source: z.ZodOptional<z.ZodString>;
    target: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    inReplyTo: z.ZodOptional<z.ZodString>;
    attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        url: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        text: z.ZodOptional<z.ZodString>;
        contentType: z.ZodOptional<z.ZodEnum<{
            readonly IMAGE: "image";
            readonly VIDEO: "video";
            readonly AUDIO: "audio";
            readonly DOCUMENT: "document";
            readonly LINK: "link";
        }>>;
    }, z.core.$loose>>>;
    channelType: z.ZodOptional<z.ZodEnum<{
        readonly SELF: "SELF";
        readonly DM: "DM";
        readonly GROUP: "GROUP";
        readonly VOICE_DM: "VOICE_DM";
        readonly VOICE_GROUP: "VOICE_GROUP";
        readonly FEED: "FEED";
        readonly THREAD: "THREAD";
        readonly WORLD: "WORLD";
        readonly FORUM: "FORUM";
        readonly AUTONOMOUS: "AUTONOMOUS";
        readonly API: "API";
    }>>;
}, z.core.$loose>;
export declare const messageExampleSchema: z.ZodObject<{
    name: z.ZodString;
    content: z.ZodObject<{
        text: z.ZodOptional<z.ZodString>;
        thought: z.ZodOptional<z.ZodString>;
        actions: z.ZodOptional<z.ZodArray<z.ZodString>>;
        providers: z.ZodOptional<z.ZodArray<z.ZodString>>;
        source: z.ZodOptional<z.ZodString>;
        target: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        inReplyTo: z.ZodOptional<z.ZodString>;
        attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            url: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            source: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            text: z.ZodOptional<z.ZodString>;
            contentType: z.ZodOptional<z.ZodEnum<{
                readonly IMAGE: "image";
                readonly VIDEO: "video";
                readonly AUDIO: "audio";
                readonly DOCUMENT: "document";
                readonly LINK: "link";
            }>>;
        }, z.core.$loose>>>;
        channelType: z.ZodOptional<z.ZodEnum<{
            readonly SELF: "SELF";
            readonly DM: "DM";
            readonly GROUP: "GROUP";
            readonly VOICE_DM: "VOICE_DM";
            readonly VOICE_GROUP: "VOICE_GROUP";
            readonly FEED: "FEED";
            readonly THREAD: "THREAD";
            readonly WORLD: "WORLD";
            readonly FORUM: "FORUM";
            readonly AUTONOMOUS: "AUTONOMOUS";
            readonly API: "API";
        }>>;
    }, z.core.$loose>;
}, z.core.$strip>;
export declare const documentDirectorySchema: z.ZodObject<{
    path: z.ZodString;
    shared: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const documentItemSchema: z.ZodUnion<readonly [z.ZodObject<{
    item: z.ZodObject<{
        case: z.ZodLiteral<"path">;
        value: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    item: z.ZodObject<{
        case: z.ZodLiteral<"directory">;
        value: z.ZodObject<{
            path: z.ZodString;
            shared: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>]>;
export declare const messageExampleGroupSchema: z.ZodObject<{
    examples: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        content: z.ZodObject<{
            text: z.ZodOptional<z.ZodString>;
            thought: z.ZodOptional<z.ZodString>;
            actions: z.ZodOptional<z.ZodArray<z.ZodString>>;
            providers: z.ZodOptional<z.ZodArray<z.ZodString>>;
            source: z.ZodOptional<z.ZodString>;
            target: z.ZodOptional<z.ZodString>;
            url: z.ZodOptional<z.ZodString>;
            inReplyTo: z.ZodOptional<z.ZodString>;
            attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                url: z.ZodString;
                title: z.ZodOptional<z.ZodString>;
                source: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                text: z.ZodOptional<z.ZodString>;
                contentType: z.ZodOptional<z.ZodEnum<{
                    readonly IMAGE: "image";
                    readonly VIDEO: "video";
                    readonly AUDIO: "audio";
                    readonly DOCUMENT: "document";
                    readonly LINK: "link";
                }>>;
            }, z.core.$loose>>>;
            channelType: z.ZodOptional<z.ZodEnum<{
                readonly SELF: "SELF";
                readonly DM: "DM";
                readonly GROUP: "GROUP";
                readonly VOICE_DM: "VOICE_DM";
                readonly VOICE_GROUP: "VOICE_GROUP";
                readonly FEED: "FEED";
                readonly THREAD: "THREAD";
                readonly WORLD: "WORLD";
                readonly FORUM: "FORUM";
                readonly AUTONOMOUS: "AUTONOMOUS";
                readonly API: "API";
            }>>;
        }, z.core.$loose>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const styleSchema: z.ZodOptional<z.ZodObject<{
    all: z.ZodDefault<z.ZodArray<z.ZodString>>;
    chat: z.ZodDefault<z.ZodArray<z.ZodString>>;
    post: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strip>>;
export declare const settingsSchema: z.ZodOptional<z.ZodPipe<z.ZodObject<{
    shouldRespondModel: z.ZodOptional<z.ZodString>;
    "basic-capabilitiesDefllmoff": z.ZodOptional<z.ZodBoolean>;
    "basic-capabilitiesKeepResp": z.ZodOptional<z.ZodBoolean>;
    providersTotalTimeoutMs: z.ZodOptional<z.ZodNumber>;
    alwaysRespondChannels: z.ZodOptional<z.ZodString>;
    alwaysRespondSources: z.ZodOptional<z.ZodString>;
    defaultTemperature: z.ZodOptional<z.ZodNumber>;
    defaultMaxTokens: z.ZodOptional<z.ZodNumber>;
    maxReplyTokens: z.ZodOptional<z.ZodNumber>;
    defaultFrequencyPenalty: z.ZodOptional<z.ZodNumber>;
    defaultPresencePenalty: z.ZodOptional<z.ZodNumber>;
    disableBasicCapabilities: z.ZodOptional<z.ZodBoolean>;
    enableExtendedCapabilities: z.ZodOptional<z.ZodBoolean>;
    extra: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<JsonValue, unknown, z.core.$ZodTypeInternals<JsonValue, unknown>>>>;
}, z.core.$loose>, z.ZodTransform<Record<string, JsonValue>, {
    [x: string]: unknown;
    shouldRespondModel?: string | undefined;
    "basic-capabilitiesDefllmoff"?: boolean | undefined;
    "basic-capabilitiesKeepResp"?: boolean | undefined;
    providersTotalTimeoutMs?: number | undefined;
    alwaysRespondChannels?: string | undefined;
    alwaysRespondSources?: string | undefined;
    defaultTemperature?: number | undefined;
    defaultMaxTokens?: number | undefined;
    maxReplyTokens?: number | undefined;
    defaultFrequencyPenalty?: number | undefined;
    defaultPresencePenalty?: number | undefined;
    disableBasicCapabilities?: boolean | undefined;
    enableExtendedCapabilities?: boolean | undefined;
    extra?: Record<string, JsonValue> | undefined;
}>>>;
export declare const secretsSchema: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
export declare const characterSchema: z.ZodPipe<z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    username: z.ZodOptional<z.ZodString>;
    system: z.ZodOptional<z.ZodString>;
    templates: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodCustom<TemplateType, TemplateType>]>>>;
    bio: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>, z.ZodTransform<string[], string | string[] | undefined>>;
    messageExamples: z.ZodDefault<z.ZodPipe<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        examples: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            content: z.ZodObject<{
                text: z.ZodOptional<z.ZodString>;
                thought: z.ZodOptional<z.ZodString>;
                actions: z.ZodOptional<z.ZodArray<z.ZodString>>;
                providers: z.ZodOptional<z.ZodArray<z.ZodString>>;
                source: z.ZodOptional<z.ZodString>;
                target: z.ZodOptional<z.ZodString>;
                url: z.ZodOptional<z.ZodString>;
                inReplyTo: z.ZodOptional<z.ZodString>;
                attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    url: z.ZodString;
                    title: z.ZodOptional<z.ZodString>;
                    source: z.ZodOptional<z.ZodString>;
                    description: z.ZodOptional<z.ZodString>;
                    text: z.ZodOptional<z.ZodString>;
                    contentType: z.ZodOptional<z.ZodEnum<{
                        readonly IMAGE: "image";
                        readonly VIDEO: "video";
                        readonly AUDIO: "audio";
                        readonly DOCUMENT: "document";
                        readonly LINK: "link";
                    }>>;
                }, z.core.$loose>>>;
                channelType: z.ZodOptional<z.ZodEnum<{
                    readonly SELF: "SELF";
                    readonly DM: "DM";
                    readonly GROUP: "GROUP";
                    readonly VOICE_DM: "VOICE_DM";
                    readonly VOICE_GROUP: "VOICE_GROUP";
                    readonly FEED: "FEED";
                    readonly THREAD: "THREAD";
                    readonly WORLD: "WORLD";
                    readonly FORUM: "FORUM";
                    readonly AUTONOMOUS: "AUTONOMOUS";
                    readonly API: "API";
                }>>;
            }, z.core.$loose>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        content: z.ZodObject<{
            text: z.ZodOptional<z.ZodString>;
            thought: z.ZodOptional<z.ZodString>;
            actions: z.ZodOptional<z.ZodArray<z.ZodString>>;
            providers: z.ZodOptional<z.ZodArray<z.ZodString>>;
            source: z.ZodOptional<z.ZodString>;
            target: z.ZodOptional<z.ZodString>;
            url: z.ZodOptional<z.ZodString>;
            inReplyTo: z.ZodOptional<z.ZodString>;
            attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                url: z.ZodString;
                title: z.ZodOptional<z.ZodString>;
                source: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                text: z.ZodOptional<z.ZodString>;
                contentType: z.ZodOptional<z.ZodEnum<{
                    readonly IMAGE: "image";
                    readonly VIDEO: "video";
                    readonly AUDIO: "audio";
                    readonly DOCUMENT: "document";
                    readonly LINK: "link";
                }>>;
            }, z.core.$loose>>>;
            channelType: z.ZodOptional<z.ZodEnum<{
                readonly SELF: "SELF";
                readonly DM: "DM";
                readonly GROUP: "GROUP";
                readonly VOICE_DM: "VOICE_DM";
                readonly VOICE_GROUP: "VOICE_GROUP";
                readonly FEED: "FEED";
                readonly THREAD: "THREAD";
                readonly WORLD: "WORLD";
                readonly FORUM: "FORUM";
                readonly AUTONOMOUS: "AUTONOMOUS";
                readonly API: "API";
            }>>;
        }, z.core.$loose>;
    }, z.core.$strip>>]>>, z.ZodTransform<{
        examples: {
            name: string;
            content: {
                [x: string]: unknown;
                text?: string | undefined;
                thought?: string | undefined;
                actions?: string[] | undefined;
                providers?: string[] | undefined;
                source?: string | undefined;
                target?: string | undefined;
                url?: string | undefined;
                inReplyTo?: string | undefined;
                attachments?: {
                    [x: string]: unknown;
                    id: string;
                    url: string;
                    title?: string | undefined;
                    source?: string | undefined;
                    description?: string | undefined;
                    text?: string | undefined;
                    contentType?: "image" | "video" | "audio" | "document" | "link" | undefined;
                }[] | undefined;
                channelType?: "SELF" | "DM" | "GROUP" | "VOICE_DM" | "VOICE_GROUP" | "FEED" | "THREAD" | "WORLD" | "FORUM" | "AUTONOMOUS" | "API" | undefined;
            };
        }[];
    }[], ({
        name: string;
        content: {
            [x: string]: unknown;
            text?: string | undefined;
            thought?: string | undefined;
            actions?: string[] | undefined;
            providers?: string[] | undefined;
            source?: string | undefined;
            target?: string | undefined;
            url?: string | undefined;
            inReplyTo?: string | undefined;
            attachments?: {
                [x: string]: unknown;
                id: string;
                url: string;
                title?: string | undefined;
                source?: string | undefined;
                description?: string | undefined;
                text?: string | undefined;
                contentType?: "image" | "video" | "audio" | "document" | "link" | undefined;
            }[] | undefined;
            channelType?: "SELF" | "DM" | "GROUP" | "VOICE_DM" | "VOICE_GROUP" | "FEED" | "THREAD" | "WORLD" | "FORUM" | "AUTONOMOUS" | "API" | undefined;
        };
    }[] | {
        examples: {
            name: string;
            content: {
                [x: string]: unknown;
                text?: string | undefined;
                thought?: string | undefined;
                actions?: string[] | undefined;
                providers?: string[] | undefined;
                source?: string | undefined;
                target?: string | undefined;
                url?: string | undefined;
                inReplyTo?: string | undefined;
                attachments?: {
                    [x: string]: unknown;
                    id: string;
                    url: string;
                    title?: string | undefined;
                    source?: string | undefined;
                    description?: string | undefined;
                    text?: string | undefined;
                    contentType?: "image" | "video" | "audio" | "document" | "link" | undefined;
                }[] | undefined;
                channelType?: "SELF" | "DM" | "GROUP" | "VOICE_DM" | "VOICE_GROUP" | "FEED" | "THREAD" | "WORLD" | "FORUM" | "AUTONOMOUS" | "API" | undefined;
            };
        }[];
    })[]>>>;
    postExamples: z.ZodDefault<z.ZodArray<z.ZodString>>;
    topics: z.ZodDefault<z.ZodArray<z.ZodString>>;
    adjectives: z.ZodDefault<z.ZodArray<z.ZodString>>;
    documents: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        item: z.ZodObject<{
            case: z.ZodLiteral<"path">;
            value: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>, z.ZodObject<{
        item: z.ZodObject<{
            case: z.ZodLiteral<"directory">;
            value: z.ZodObject<{
                path: z.ZodString;
                shared: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>;
        }, z.core.$strip>;
    }, z.core.$strip>]>>>;
    knowledge: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        item: z.ZodObject<{
            case: z.ZodLiteral<"path">;
            value: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>, z.ZodObject<{
        item: z.ZodObject<{
            case: z.ZodLiteral<"directory">;
            value: z.ZodObject<{
                path: z.ZodString;
                shared: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>;
        }, z.core.$strip>;
    }, z.core.$strip>]>>>;
    plugins: z.ZodDefault<z.ZodArray<z.ZodString>>;
    settings: z.ZodOptional<z.ZodPipe<z.ZodObject<{
        shouldRespondModel: z.ZodOptional<z.ZodString>;
        "basic-capabilitiesDefllmoff": z.ZodOptional<z.ZodBoolean>;
        "basic-capabilitiesKeepResp": z.ZodOptional<z.ZodBoolean>;
        providersTotalTimeoutMs: z.ZodOptional<z.ZodNumber>;
        alwaysRespondChannels: z.ZodOptional<z.ZodString>;
        alwaysRespondSources: z.ZodOptional<z.ZodString>;
        defaultTemperature: z.ZodOptional<z.ZodNumber>;
        defaultMaxTokens: z.ZodOptional<z.ZodNumber>;
        maxReplyTokens: z.ZodOptional<z.ZodNumber>;
        defaultFrequencyPenalty: z.ZodOptional<z.ZodNumber>;
        defaultPresencePenalty: z.ZodOptional<z.ZodNumber>;
        disableBasicCapabilities: z.ZodOptional<z.ZodBoolean>;
        enableExtendedCapabilities: z.ZodOptional<z.ZodBoolean>;
        extra: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<JsonValue, unknown, z.core.$ZodTypeInternals<JsonValue, unknown>>>>;
    }, z.core.$loose>, z.ZodTransform<Record<string, JsonValue>, {
        [x: string]: unknown;
        shouldRespondModel?: string | undefined;
        "basic-capabilitiesDefllmoff"?: boolean | undefined;
        "basic-capabilitiesKeepResp"?: boolean | undefined;
        providersTotalTimeoutMs?: number | undefined;
        alwaysRespondChannels?: string | undefined;
        alwaysRespondSources?: string | undefined;
        defaultTemperature?: number | undefined;
        defaultMaxTokens?: number | undefined;
        maxReplyTokens?: number | undefined;
        defaultFrequencyPenalty?: number | undefined;
        defaultPresencePenalty?: number | undefined;
        disableBasicCapabilities?: boolean | undefined;
        enableExtendedCapabilities?: boolean | undefined;
        extra?: Record<string, JsonValue> | undefined;
    }>>>;
    secrets: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
    style: z.ZodOptional<z.ZodObject<{
        all: z.ZodDefault<z.ZodArray<z.ZodString>>;
        chat: z.ZodDefault<z.ZodArray<z.ZodString>>;
        post: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    advancedPlanning: z.ZodOptional<z.ZodBoolean>;
    advancedMemory: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>, z.ZodTransform<{
    documents: ({
        item: {
            case: "path";
            value: string;
        };
    } | {
        item: {
            case: "directory";
            value: {
                path: string;
                shared?: boolean | undefined;
            };
        };
    })[];
    name: string;
    templates: Record<string, TemplateType>;
    bio: string[];
    messageExamples: {
        examples: {
            name: string;
            content: {
                [x: string]: unknown;
                text?: string | undefined;
                thought?: string | undefined;
                actions?: string[] | undefined;
                providers?: string[] | undefined;
                source?: string | undefined;
                target?: string | undefined;
                url?: string | undefined;
                inReplyTo?: string | undefined;
                attachments?: {
                    [x: string]: unknown;
                    id: string;
                    url: string;
                    title?: string | undefined;
                    source?: string | undefined;
                    description?: string | undefined;
                    text?: string | undefined;
                    contentType?: "image" | "video" | "audio" | "document" | "link" | undefined;
                }[] | undefined;
                channelType?: "SELF" | "DM" | "GROUP" | "VOICE_DM" | "VOICE_GROUP" | "FEED" | "THREAD" | "WORLD" | "FORUM" | "AUTONOMOUS" | "API" | undefined;
            };
        }[];
    }[];
    postExamples: string[];
    topics: string[];
    adjectives: string[];
    plugins: string[];
    secrets: Record<string, string | number | boolean>;
    id?: string | undefined;
    username?: string | undefined;
    system?: string | undefined;
    settings?: Record<string, JsonValue> | undefined;
    style?: {
        all: string[];
        chat: string[];
        post: string[];
    } | undefined;
    advancedPlanning?: boolean | undefined;
    advancedMemory?: boolean | undefined;
}, {
    name: string;
    templates: Record<string, TemplateType>;
    bio: string[];
    messageExamples: {
        examples: {
            name: string;
            content: {
                [x: string]: unknown;
                text?: string | undefined;
                thought?: string | undefined;
                actions?: string[] | undefined;
                providers?: string[] | undefined;
                source?: string | undefined;
                target?: string | undefined;
                url?: string | undefined;
                inReplyTo?: string | undefined;
                attachments?: {
                    [x: string]: unknown;
                    id: string;
                    url: string;
                    title?: string | undefined;
                    source?: string | undefined;
                    description?: string | undefined;
                    text?: string | undefined;
                    contentType?: "image" | "video" | "audio" | "document" | "link" | undefined;
                }[] | undefined;
                channelType?: "SELF" | "DM" | "GROUP" | "VOICE_DM" | "VOICE_GROUP" | "FEED" | "THREAD" | "WORLD" | "FORUM" | "AUTONOMOUS" | "API" | undefined;
            };
        }[];
    }[];
    postExamples: string[];
    topics: string[];
    adjectives: string[];
    documents: ({
        item: {
            case: "path";
            value: string;
        };
    } | {
        item: {
            case: "directory";
            value: {
                path: string;
                shared?: boolean | undefined;
            };
        };
    })[];
    plugins: string[];
    secrets: Record<string, string | number | boolean>;
    id?: string | undefined;
    username?: string | undefined;
    system?: string | undefined;
    knowledge?: ({
        item: {
            case: "path";
            value: string;
        };
    } | {
        item: {
            case: "directory";
            value: {
                path: string;
                shared?: boolean | undefined;
            };
        };
    })[] | undefined;
    settings?: Record<string, JsonValue> | undefined;
    style?: {
        all: string[];
        chat: string[];
        post: string[];
    } | undefined;
    advancedPlanning?: boolean | undefined;
    advancedMemory?: boolean | undefined;
}>>;
export interface CharacterValidationResult {
    success: boolean;
    data?: Character;
    error?: {
        message: string;
        issues?: z.ZodIssue[];
    };
}
/**
 * Safely validates character data using Zod schema
 */
export declare function validateCharacter(data: unknown): CharacterValidationResult;
/**
 * Safely parses JSON string and validates as character
 */
export declare function parseAndValidateCharacter(jsonString: string): CharacterValidationResult;
/**
 * Type guard to check if data is a valid Character
 */
export declare function isValidCharacter(data: unknown): data is Character;
//# sourceMappingURL=character.d.ts.map