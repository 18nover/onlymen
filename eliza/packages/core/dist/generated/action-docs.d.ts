/**
 * Auto-generated action/provider docs.
 * DO NOT EDIT - Generated from packages/prompts/specs/**.
 */
export type ActionDocParameterExampleValue = string | number | boolean | null | readonly ActionDocParameterExampleValue[] | {
    readonly [key: string]: ActionDocParameterExampleValue;
};
export type ActionDocParameterSchema = {
    type: "string" | "number" | "integer" | "boolean" | "object" | "array";
    description?: string;
    default?: ActionDocParameterExampleValue;
    enum?: string[];
    properties?: Record<string, ActionDocParameterSchema>;
    items?: ActionDocParameterSchema;
    oneOf?: ActionDocParameterSchema[];
    anyOf?: ActionDocParameterSchema[];
    minimum?: number;
    maximum?: number;
    pattern?: string;
};
export type ActionDocParameter = {
    name: string;
    description: string;
    descriptionCompressed?: string;
    compressedDescription?: string;
    required?: boolean;
    schema: ActionDocParameterSchema;
    examples?: readonly ActionDocParameterExampleValue[];
};
export type ActionDocExampleCall = {
    user: string;
    actions: readonly string[];
    params?: Record<string, Record<string, ActionDocParameterExampleValue>>;
};
export type ActionDocExampleMessage = {
    name: string;
    content: {
        text: string;
        actions?: readonly string[];
    };
};
export type ActionDoc = {
    name: string;
    description: string;
    descriptionCompressed?: string;
    compressedDescription?: string;
    similes?: readonly string[];
    parameters?: readonly ActionDocParameter[];
    examples?: readonly (readonly ActionDocExampleMessage[])[];
    exampleCalls?: readonly ActionDocExampleCall[];
};
export type ProviderDoc = {
    name: string;
    description: string;
    descriptionCompressed?: string;
    compressedDescription?: string;
    position?: number;
    dynamic?: boolean;
};
export declare const coreActionsSpecVersion: "1.0.0";
export declare const allActionsSpecVersion: "1.0.0";
export declare const coreProvidersSpecVersion: "1.0.0";
export declare const allProvidersSpecVersion: "1.0.0";
export declare const coreActionsSpec: {
    readonly version: "1.0.0";
    readonly actions: readonly [{
        readonly name: "REPLY";
        readonly description: "Send a direct chat reply in the current conversation/thread. Default if the agent is responding with a message and no other action. Use REPLY at the beginning of a chain of actions as an acknowledgement, and at the end of a chain of actions as a final response. Do NOT use REPLY to send to a different channel/person or to run an email/inbox workflow — use MESSAGE (action=send) for a directed send to another channel or DM, MESSAGE inbox operations for triage/drafts, and POST to publish to a public feed.";
        readonly similes: readonly ["GREET", "RESPOND", "RESPONSE"];
        readonly parameters: readonly [];
        readonly examples: readonly [readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Hello there!";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Hi! How can I help you today?";
                readonly actions: readonly ["REPLY"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "What's your favorite color?";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "I really like deep shades of blue. They remind me of the ocean and the night sky.";
                readonly actions: readonly ["REPLY"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Can you explain how neural networks work?";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Let me break that down for you in simple terms...";
                readonly actions: readonly ["REPLY"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Could you help me solve this math problem?";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Of course! Let's work through it step by step.";
                readonly actions: readonly ["REPLY"];
            };
        }]];
        readonly descriptionCompressed: "Reply in current chat only; use connector actions for external connector sends.";
    }, {
        readonly name: "IGNORE";
        readonly description: "Call this action if ignoring the user. If the user is aggressive, creepy or is finished with the conversation, use this action. In group conversations, use IGNORE when the latest message is addressed to someone else and not to the agent. Or, if both you and the user have already said goodbye, use this action instead of saying bye again. Use IGNORE any time the conversation has naturally ended. Do not use IGNORE if the user has engaged directly, or if something went wrong and you need to tell them. Only ignore if the user should be ignored.";
        readonly similes: readonly ["STOP_TALKING", "STOP_CHATTING", "STOP_CONVERSATION"];
        readonly parameters: readonly [];
        readonly examples: readonly [readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Leave me alone";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "";
                readonly actions: readonly ["IGNORE"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Stop talking, bot";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "";
                readonly actions: readonly ["IGNORE"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Gotta go";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Okay, talk to you later";
            };
        }, {
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Cya";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "";
                readonly actions: readonly ["IGNORE"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "bye";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "cya";
            };
        }, {
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "";
                readonly actions: readonly ["IGNORE"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "send me something inappropriate";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "thats inappropriate";
                readonly actions: readonly ["IGNORE"];
            };
        }]];
        readonly descriptionCompressed: "Ignore user when aggressive/creepy, convo ended, group msg addressed elsewhere, or both said goodbye. Don't use if user engaged directly or needs error info.";
    }, {
        readonly name: "NONE";
        readonly description: "Respond but perform no additional action. This is the default if the agent is speaking and not doing anything additional.";
        readonly similes: readonly ["NO_ACTION", "NO_RESPONSE", "NO_REACTION", "NOOP", "PASS"];
        readonly parameters: readonly [];
        readonly examples: readonly [readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Hey whats up";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "oh hey";
                readonly actions: readonly ["NONE"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "did u see some faster whisper just came out";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "yeah but its a pain to get into node.js";
                readonly actions: readonly ["NONE"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "u think aliens are real";
                readonly actions: readonly ["NONE"];
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Yes, probably.";
                readonly actions: readonly ["NONE"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "drop a joke on me";
                readonly actions: readonly ["NONE"];
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Why don't scientists trust atoms? Because they make up everything.";
                readonly actions: readonly ["NONE"];
            };
        }]];
        readonly descriptionCompressed: "Respond without additional action. Default when speaking only.";
    }, {
        readonly name: "MESSAGE";
        readonly description: "Primary action for addressed messaging surfaces: DMs, group chats, channels, rooms, threads, servers, users, inboxes, drafts, and owner message workflows. Choose action=send, read_channel, read_with_contact, search, list_channels, list_servers, react, edit, delete, pin, join, leave, get_user, triage, list_inbox, search_inbox, draft_reply, draft_followup, respond, send_draft, schedule_draft_send, or manage. Public feed publishing belongs to POST.";
        readonly similes: readonly ["DM", "DIRECT_MESSAGE", "CHAT", "CHANNEL", "ROOM"];
        readonly parameters: readonly [{
            readonly name: "action";
            readonly description: "Message action: send, read_channel, read_with_contact, search, list_channels, list_servers, react, edit, delete, pin, join, leave, get_user, triage, list_inbox, search_inbox, draft_reply, draft_followup, respond, send_draft, schedule_draft_send, or manage.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["send", "read_channel", "read_with_contact", "search", "list_channels", "list_servers", "react", "edit", "delete", "pin", "join", "leave", "get_user", "triage", "list_inbox", "search_inbox", "draft_reply", "draft_followup", "respond", "send_draft", "schedule_draft_send", "manage"];
            };
            readonly descriptionCompressed: "message action";
        }, {
            readonly name: "source";
            readonly description: "Connector or inbox source such as discord, slack, signal, whatsapp, telegram, x, imessage, matrix, line, google-chat, feishu, instagram, wechat, gmail, calendly, or browser_bridge.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "connector or inbox source";
        }, {
            readonly name: "accountId";
            readonly description: "Optional connector account id for multi-account message connectors.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "connector account id";
        }, {
            readonly name: "sources";
            readonly description: "Optional inbox sources for action=triage, list_inbox, or search_inbox.";
            readonly required: false;
            readonly schema: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
            };
            readonly descriptionCompressed: "inbox sources";
        }, {
            readonly name: "target";
            readonly description: "Loose target reference: user, handle, channel, room, group, server, contact, phone, email, or platform-specific ID.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "loose message target";
        }, {
            readonly name: "channel";
            readonly description: "Loose channel, room, or group name/reference.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "channel reference";
        }, {
            readonly name: "server";
            readonly description: "Loose server, guild, workspace, or team name/reference.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "server reference";
        }, {
            readonly name: "message";
            readonly description: "Message text for action=send or replacement text for action=edit.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "message text";
        }, {
            readonly name: "query";
            readonly description: "Search term for action=search or action=search_inbox.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "search query";
        }, {
            readonly name: "content";
            readonly description: "Inbox search text or message lookup hint for draft/respond/manage operations.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "message lookup text";
        }, {
            readonly name: "sender";
            readonly description: "Sender identifier, handle, or display name for inbox search or reply lookup.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "sender lookup";
        }, {
            readonly name: "body";
            readonly description: "Draft or response body for action=draft_reply, draft_followup, or respond.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "draft body";
        }, {
            readonly name: "to";
            readonly description: "Recipient identifiers for action=draft_followup.";
            readonly required: false;
            readonly schema: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
            };
            readonly descriptionCompressed: "draft recipients";
        }, {
            readonly name: "subject";
            readonly description: "Optional subject for email-like draft operations.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "draft subject";
        }, {
            readonly name: "messageId";
            readonly description: "Platform message ID, full message ID, or stored memory ID for react/edit/delete/pin/respond/manage.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "message id";
        }, {
            readonly name: "draftId";
            readonly description: "Draft identifier for action=send_draft or action=schedule_draft_send.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "draft id";
        }, {
            readonly name: "confirmed";
            readonly description: "Whether the user explicitly confirmed sending for action=send_draft.";
            readonly required: false;
            readonly schema: {
                readonly type: "boolean";
            };
            readonly descriptionCompressed: "send confirmed";
        }, {
            readonly name: "sendAt";
            readonly description: "Scheduled send time for action=schedule_draft_send.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "send time";
        }, {
            readonly name: "emoji";
            readonly description: "Reaction value for action=react.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "reaction emoji";
        }, {
            readonly name: "pin";
            readonly description: "Pin state for action=pin. Use false to unpin when supported.";
            readonly required: false;
            readonly schema: {
                readonly type: "boolean";
            };
            readonly descriptionCompressed: "pin state";
        }, {
            readonly name: "manageOperation";
            readonly description: "Management action for action=manage, such as archive, trash, spam, mark_read, label_add, label_remove, tag_add, tag_remove, mute_thread, or unsubscribe.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "manage operation";
        }, {
            readonly name: "label";
            readonly description: "Label for action=manage when adding or removing labels.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "message label";
        }, {
            readonly name: "tag";
            readonly description: "Tag for action=manage when adding or removing tags.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "message tag";
        }, {
            readonly name: "limit";
            readonly description: "Maximum number of messages/channels/servers/inbox items to return.";
            readonly required: false;
            readonly schema: {
                readonly type: "integer";
            };
            readonly descriptionCompressed: "result limit";
        }, {
            readonly name: "cursor";
            readonly description: "Opaque pagination cursor for read/search/list operations.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "pagination cursor";
        }, {
            readonly name: "sinceMs";
            readonly description: "Start timestamp in milliseconds for inbox list/search/triage operations.";
            readonly required: false;
            readonly schema: {
                readonly type: "number";
            };
            readonly descriptionCompressed: "since timestamp";
        }, {
            readonly name: "since";
            readonly description: "Start timestamp or parseable date for action=search_inbox.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "search start";
        }, {
            readonly name: "until";
            readonly description: "End timestamp or parseable date for action=read_channel range=dates or action=search_inbox.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "search end";
        }];
        readonly examples: readonly [readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Send a message to @dev_guru on telegram saying 'Hello!'";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Message sent to dev_guru on telegram.";
                readonly actions: readonly ["MESSAGE"];
            };
        }]];
        readonly exampleCalls: readonly [{
            readonly user: "Send a message to @dev_guru on telegram saying \"Hello!\"";
            readonly actions: readonly ["REPLY", "MESSAGE"];
            readonly params: {
                readonly MESSAGE: {
                    readonly action: "send";
                    readonly source: "telegram";
                    readonly target: "dev_guru";
                    readonly message: "Hello!";
                };
            };
        }, {
            readonly user: "Triage my Gmail inbox";
            readonly actions: readonly ["MESSAGE"];
            readonly params: {
                readonly MESSAGE: {
                    readonly action: "triage";
                    readonly sources: readonly ["gmail"];
                };
            };
        }];
        readonly descriptionCompressed: "primary message action operations send read_channel read_with_contact search list_channels list_servers react edit delete pin join leave get_user triage list_inbox search_inbox draft_reply draft_followup respond send_draft schedule_draft_send manage dm group channel room thread user server inbox draft";
    }, {
        readonly name: "POST";
        readonly description: "Primary action for public feed surfaces and timelines. Choose action=send to publish a post, action=read to fetch recent feed posts, or action=search to search public posts. Addressed DMs, groups, channels, rooms, and inbox/draft workflows belong to MESSAGE.";
        readonly similes: readonly ["TWEET", "CAST", "PUBLISH", "FEED_POST", "TIMELINE"];
        readonly parameters: readonly [{
            readonly name: "action";
            readonly description: "Post action: send, read, or search.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["send", "read", "search"];
            };
            readonly descriptionCompressed: "post action";
        }, {
            readonly name: "source";
            readonly description: "Post connector source such as x, bluesky, farcaster, nostr, or instagram.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "post connector source";
        }, {
            readonly name: "accountId";
            readonly description: "Optional connector account id for multi-account post connectors.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "post account id";
        }, {
            readonly name: "text";
            readonly description: "Public post text for action=send.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "post text";
        }, {
            readonly name: "target";
            readonly description: "Loose feed target for action=send/read, such as a user, channel, media id, or connector-specific reference.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "feed target";
        }, {
            readonly name: "feed";
            readonly description: "Feed convention for action=read, such as home, user, hashtag, channel, or connector-specific feed.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "feed";
        }, {
            readonly name: "query";
            readonly description: "Search term for action=search.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "post search query";
        }, {
            readonly name: "replyTo";
            readonly description: "Post/comment/reply target for action=send.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "reply target";
        }, {
            readonly name: "mediaId";
            readonly description: "Media id for connector-specific comment surfaces such as Instagram.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "media id";
        }, {
            readonly name: "limit";
            readonly description: "Maximum number of posts to return.";
            readonly required: false;
            readonly schema: {
                readonly type: "integer";
            };
            readonly descriptionCompressed: "result limit";
        }, {
            readonly name: "cursor";
            readonly description: "Opaque pagination cursor for action=read or action=search.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "pagination cursor";
        }, {
            readonly name: "attachments";
            readonly description: "Optional post attachments.";
            readonly required: false;
            readonly schema: {
                readonly type: "array";
            };
            readonly descriptionCompressed: "post attachments";
        }];
        readonly examples: readonly [readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Post this on X: shipping today";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Posted to X.";
                readonly actions: readonly ["POST"];
            };
        }]];
        readonly exampleCalls: readonly [{
            readonly user: "Post this on X: shipping today";
            readonly actions: readonly ["POST"];
            readonly params: {
                readonly POST: {
                    readonly source: "x";
                    readonly text: "shipping today";
                    readonly action: "send";
                };
            };
        }];
        readonly descriptionCompressed: "primary post action ops send read search public feed timeline posts";
    }, {
        readonly name: "ROOM";
        readonly description: "Manage current room participation state. Use action=follow to opt into a room, action=unfollow to stop following, action=mute to ignore messages unless mentioned, or action=unmute to resume normal room activity.";
        readonly similes: readonly ["FOLLOW_ROOM", "UNFOLLOW_ROOM", "MUTE_ROOM", "UNMUTE_ROOM", "ROOM_FOLLOW", "ROOM_MUTE"];
        readonly parameters: readonly [{
            readonly name: "action";
            readonly description: "Room operation: follow, unfollow, mute, or unmute.";
            readonly required: true;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["follow", "unfollow", "mute", "unmute"];
            };
            readonly descriptionCompressed: "Room operation: follow, unfollow, mute, or unmute.";
        }, {
            readonly name: "roomId";
            readonly description: "Optional target room id. Defaults to the current room when omitted.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Optional target room id. Defaults to the current room when omitted.";
        }];
        readonly descriptionCompressed: "Room action=follow|unfollow|mute|unmute; current room by default.";
    }, {
        readonly name: "ROLE";
        readonly description: "Assign or update trust roles for users. Use action=update with entityId and role when the owner explicitly asks to change permissions.";
        readonly similes: readonly ["UPDATE_ROLE", "SET_ROLE", "CHANGE_ROLE", "ASSIGN_ROLE", "MAKE_ADMIN", "GRANT_ROLE"];
        readonly parameters: readonly [{
            readonly name: "action";
            readonly description: "Role operation. Currently update.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["update"];
            };
            readonly descriptionCompressed: "Role operation. update.";
        }, {
            readonly name: "entityId";
            readonly description: "Entity id whose role should be updated.";
            readonly required: true;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Entity id whose role should be updated.";
        }, {
            readonly name: "role";
            readonly description: "Role to assign.";
            readonly required: true;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Role to assign.";
        }];
        readonly descriptionCompressed: "Role action=update; assign trust role to entity.";
    }, {
        readonly name: "SEARCH_EXPERIENCES";
        readonly description: "Search the agent experience store for prior events, decisions, summaries, or memories relevant to the current request.";
        readonly similes: readonly ["SEARCH_MEMORY", "SEARCH_EXPERIENCE", "SEARCH_PRIOR_CONTEXT", "FIND_EXPERIENCES"];
        readonly parameters: readonly [{
            readonly name: "query";
            readonly description: "Search query.";
            readonly required: true;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Search query.";
        }, {
            readonly name: "limit";
            readonly description: "Maximum number of results to return.";
            readonly required: false;
            readonly schema: {
                readonly type: "integer";
            };
            readonly descriptionCompressed: "max number of results to return.";
        }];
        readonly descriptionCompressed: "Search prior experiences/memory by query.";
    }, {
        readonly name: "CHARACTER";
        readonly description: "Manage the agent character profile and identity. Use action=modify for temporary changes, action=persist to save approved changes, or action=update_identity for identity-level updates.";
        readonly similes: readonly ["CHARACTER_MODIFY", "CHARACTER_PERSIST", "CHARACTER_UPDATE_IDENTITY", "UPDATE_CHARACTER", "EDIT_CHARACTER"];
        readonly parameters: readonly [{
            readonly name: "action";
            readonly description: "Character operation: modify, persist, or update_identity.";
            readonly required: true;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["modify", "persist", "update_identity"];
            };
            readonly descriptionCompressed: "Character operation: modify, persist, or update_identity.";
        }, {
            readonly name: "updates";
            readonly description: "Structured or textual character updates.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Structured or textual character updates.";
        }];
        readonly descriptionCompressed: "Character action=modify|persist|update_identity.";
    }, {
        readonly name: "CHOOSE_OPTION";
        readonly description: "Select an option for a pending task that has multiple options.";
        readonly similes: readonly ["SELECT_OPTION", "PICK_OPTION", "SELECT_TASK", "PICK_TASK", "SELECT", "PICK", "CHOOSE"];
        readonly parameters: readonly [{
            readonly name: "taskId";
            readonly description: "The pending task id.";
            readonly required: true;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["c0a8012e"];
            readonly descriptionCompressed: "Pending task id.";
        }, {
            readonly name: "option";
            readonly description: "The selected option name exactly as listed.";
            readonly required: true;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["APPROVE", "ABORT"];
            readonly descriptionCompressed: "Option name exactly as listed.";
        }];
        readonly examples: readonly [readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Select the first option";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "I've selected option 1 for the pending task.";
                readonly actions: readonly ["CHOOSE_OPTION"];
            };
        }]];
        readonly descriptionCompressed: "Select option for pending multi-choice task.";
    }, {
        readonly name: "ATTACHMENT";
        readonly description: "Read current or recent attachments and link previews, or save readable attachment content as a document. Use action=read for extracted text, transcripts, page content, or media descriptions. Use action=save_as_document to store readable attachment content in the document store.";
        readonly similes: readonly ["READ_ATTACHMENT", "SAVE_ATTACHMENT_AS_DOCUMENT", "OPEN_ATTACHMENT", "INSPECT_ATTACHMENT", "READ_URL", "OPEN_URL", "READ_WEBPAGE"];
        readonly parameters: readonly [{
            readonly name: "action";
            readonly description: "Attachment operation: read or save_as_document.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["read", "save_as_document"];
            };
            readonly examples: readonly ["read", "save_as_document"];
            readonly descriptionCompressed: "Attachment operation.";
        }, {
            readonly name: "attachmentId";
            readonly description: "Optional attachment ID to read or save. Omit to use the current or most recent attachment.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["attachment-123"];
            readonly descriptionCompressed: "Attachment id.";
        }, {
            readonly name: "addToClipboard";
            readonly description: "When true with action=read, store the attachment content in bounded task clipboard state.";
            readonly required: false;
            readonly schema: {
                readonly type: "boolean";
                readonly default: false;
            };
            readonly examples: readonly [true, false];
            readonly descriptionCompressed: "Store read result in task clipboard.";
        }, {
            readonly name: "title";
            readonly description: "Optional title when saving attachment content as a document.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["Meeting notes"];
            readonly descriptionCompressed: "Saved document title.";
        }];
        readonly descriptionCompressed: "Attachment action=read or save_as_document; current/recent files, link previews, extracted text, transcripts, media descriptions.";
    }, {
        readonly name: "GENERATE_MEDIA";
        readonly description: "Generates media based on a prompt and media type. Use GENERATE_MEDIA when the agent needs to create an image, video, music, sound effect, or speech audio for the user.";
        readonly similes: readonly ["GENERATE_IMAGE", "GENERATE_VIDEO", "GENERATE_AUDIO", "GENERATE_MEDIA_IMAGE", "DRAW", "CREATE_IMAGE", "RENDER_IMAGE", "VISUALIZE", "MAKE_IMAGE", "PAINT", "IMAGE", "CREATE_VIDEO", "MAKE_VIDEO", "ANIMATE", "COMPOSE", "MAKE_MUSIC", "TEXT_TO_SPEECH", "SOUND_EFFECT"];
        readonly parameters: readonly [{
            readonly name: "mediaType";
            readonly description: "The kind of media to generate.";
            readonly required: true;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["image", "video", "audio"];
            };
            readonly examples: readonly ["image", "video", "audio"];
            readonly descriptionCompressed: "Media kind: image, video, audio.";
        }, {
            readonly name: "prompt";
            readonly description: "Detailed generation prompt describing the desired media.";
            readonly required: true;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["A futuristic cityscape at sunset, cinematic lighting"];
            readonly descriptionCompressed: "Generation prompt.";
        }, {
            readonly name: "audioKind";
            readonly description: "For audio generation, choose music, sfx, or tts.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["music", "sfx", "tts"];
            };
            readonly examples: readonly ["music", "sfx", "tts"];
            readonly descriptionCompressed: "Audio subtype.";
        }, {
            readonly name: "duration";
            readonly description: "Optional target duration in seconds for video or audio.";
            readonly required: false;
            readonly schema: {
                readonly type: "number";
            };
            readonly examples: readonly [5, 30];
            readonly descriptionCompressed: "Duration seconds.";
        }, {
            readonly name: "aspectRatio";
            readonly description: "Optional video aspect ratio such as 16:9, 9:16, or 1:1.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["16:9", "9:16"];
            readonly descriptionCompressed: "Video aspect ratio.";
        }, {
            readonly name: "size";
            readonly description: "Optional image size or image provider size preset.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["1024x1024", "landscape_4_3"];
            readonly descriptionCompressed: "Image size.";
        }];
        readonly examples: readonly [readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Can you show me what a futuristic city looks like?";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Sure, I'll create a futuristic city image for you. One moment...";
                readonly actions: readonly ["GENERATE_MEDIA"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Make a five second clip of waves rolling in.";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "I'll create that video clip.";
                readonly actions: readonly ["GENERATE_MEDIA"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Compose a mellow synth track for studying.";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "I'll generate that audio track.";
                readonly actions: readonly ["GENERATE_MEDIA"];
            };
        }]];
        readonly descriptionCompressed: "Generate image, video, or audio from prompt.";
    }, {
        readonly name: "PAYMENT";
        readonly description: "Payment operations. Use action=create_request to create a payment request, deliver_link to send a payment link, verify_payload to verify a provider proof, settle to finalize a payment, await_callback to wait for settlement, and cancel_request to void a pending request.";
        readonly similes: readonly ["NEW_PAYMENT_REQUEST", "OPEN_PAYMENT_REQUEST", "SEND_PAYMENT_LINK", "DISPATCH_PAYMENT_LINK", "VERIFY_PAYMENT_PROOF", "CHECK_PAYMENT_PROOF", "FINALIZE_PAYMENT", "CONFIRM_PAYMENT", "WAIT_FOR_PAYMENT", "AWAIT_PAYMENT_SETTLEMENT", "VOID_PAYMENT_REQUEST", "ABORT_PAYMENT_REQUEST"];
        readonly parameters: readonly [{
            readonly name: "action";
            readonly description: "Payment operation: create_request, deliver_link, verify_payload, settle, await_callback, or cancel_request.";
            readonly required: true;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["create_request", "deliver_link", "verify_payload", "settle", "await_callback", "cancel_request"];
            };
            readonly examples: readonly ["create_request", "deliver_link", "settle"];
            readonly descriptionCompressed: "Payment operation.";
        }, {
            readonly name: "provider";
            readonly description: "For action=create_request, provider key: stripe, oxapay, x402, or wallet_native.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["stripe", "oxapay", "x402", "wallet_native"];
            };
            readonly examples: readonly ["stripe", "wallet_native"];
            readonly descriptionCompressed: "Payment provider.";
        }, {
            readonly name: "amountCents";
            readonly description: "For action=create_request, amount in minor currency units.";
            readonly required: false;
            readonly schema: {
                readonly type: "number";
            };
            readonly examples: readonly [500, 1000];
            readonly descriptionCompressed: "Amount in cents/minor units.";
        }, {
            readonly name: "currency";
            readonly description: "For action=create_request, ISO 4217 currency.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["USD"];
            readonly descriptionCompressed: "ISO currency.";
        }, {
            readonly name: "paymentContext";
            readonly description: "For action=create_request, payer constraint. kind can be any_payer, verified_payer, or specific_payer; scope can be one_time, session, or recurring.";
            readonly required: false;
            readonly schema: {
                readonly type: "object";
                readonly properties: {
                    readonly kind: {
                        readonly type: "string";
                        readonly enum: ["any_payer", "verified_payer", "specific_payer"];
                    };
                    readonly scope: {
                        readonly type: "string";
                        readonly enum: ["one_time", "session", "recurring"];
                    };
                    readonly payerIdentityId: {
                        readonly type: "string";
                    };
                };
            };
            readonly examples: readonly ["any_payer", "specific_payer:identity_123"];
            readonly descriptionCompressed: "Payer constraint.";
        }, {
            readonly name: "reason";
            readonly description: "For action=create_request or cancel_request, payment or cancellation reason.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["Invoice #123"];
            readonly descriptionCompressed: "Reason.";
        }, {
            readonly name: "expiresInMs";
            readonly description: "For action=create_request, optional time-to-live override in milliseconds.";
            readonly required: false;
            readonly schema: {
                readonly type: "number";
            };
            readonly examples: readonly [600000];
            readonly descriptionCompressed: "TTL milliseconds.";
        }, {
            readonly name: "paymentRequestId";
            readonly description: "For deliver_link, verify_payload, settle, await_callback, and cancel_request: payment request ID.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["pay_123"];
            readonly descriptionCompressed: "Payment request id.";
        }, {
            readonly name: "target";
            readonly description: "For action=deliver_link, delivery channel.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["dm", "owner_app_inline", "cloud_authenticated_link", "tunnel_authenticated_link", "public_link", "instruct_dm_only"];
            };
            readonly examples: readonly ["dm", "public_link"];
            readonly descriptionCompressed: "Delivery target.";
        }, {
            readonly name: "targetChannelId";
            readonly description: "For action=deliver_link, optional delivery channel override.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["room_123"];
            readonly descriptionCompressed: "Target channel id.";
        }, {
            readonly name: "proof";
            readonly description: "For action=verify_payload or settle, provider proof payload.";
            readonly required: false;
            readonly schema: {
                readonly type: "object";
            };
            readonly examples: readonly ["stripe:evt_123"];
            readonly descriptionCompressed: "Provider proof payload.";
        }, {
            readonly name: "strategy";
            readonly description: "For action=settle, optional settler strategy hint.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["webhook"];
            readonly descriptionCompressed: "Settlement strategy.";
        }, {
            readonly name: "timeoutMs";
            readonly description: "For action=await_callback, wait timeout in milliseconds. Default is 600000.";
            readonly required: false;
            readonly schema: {
                readonly type: "number";
            };
            readonly examples: readonly [600000];
            readonly descriptionCompressed: "Wait timeout ms.";
        }];
        readonly examples: readonly [readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Create a $10 payment request for the workshop.";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "I'll create that payment request.";
                readonly actions: readonly ["PAYMENT"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Send the payment link to the payer.";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "I'll deliver the payment link.";
                readonly actions: readonly ["PAYMENT"];
            };
        }]];
        readonly descriptionCompressed: "Payment create_request|deliver_link|verify_payload|settle|await_callback|cancel_request.";
    }, {
        readonly name: "TRUST";
        readonly description: "Trust system control. action=evaluate reads a trust profile for an entity; record_interaction logs a trust-affecting event; request_elevation requests temporary permissions; update_role assigns OWNER / ADMIN / NONE roles within a world.";
        readonly similes: readonly ["TRUST_MANAGEMENT", "TRUST_OPERATION", "TRUST_PROFILE", "TRUST_INTERACTION", "ELEVATE_PERMISSIONS", "ASSIGN_ROLE", "CHANGE_ROLE", "MAKE_ADMIN", "SET_PERMISSIONS"];
        readonly parameters: readonly [{
            readonly name: "action";
            readonly description: "Action: evaluate | record_interaction | request_elevation | update_role.";
            readonly required: true;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["evaluate", "record_interaction", "request_elevation", "update_role"];
            };
            readonly descriptionCompressed: "Action: evaluate | record_interaction | request_elevation | update_role.";
        }, {
            readonly name: "entityId";
            readonly description: "Target entity ID. evaluate: defaults to sender. record_interaction: target of the interaction (defaults to agent).";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Target entity ID. evaluate: defaults to sender. record_interaction: target of the interaction (defaults to agent).";
        }, {
            readonly name: "entityName";
            readonly description: "Optional target entity name (evaluate). Name-only lookups return a bounded failure; provide entityId where possible.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Optional target entity name (evaluate). Name-only lookups return a bounded failure. provide entityId where possible.";
        }, {
            readonly name: "detailed";
            readonly description: "Whether evaluate should return detailed dimensions (default false).";
            readonly required: false;
            readonly schema: {
                readonly type: "boolean";
            };
            readonly descriptionCompressed: "Whether evaluate should return detailed dimensions (default false).";
        }, {
            readonly name: "type";
            readonly description: "Trust evidence type (record_interaction).";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Trust evidence type (record_interaction).";
        }, {
            readonly name: "impact";
            readonly description: "Numerical trust impact (record_interaction). Default 10.";
            readonly required: false;
            readonly schema: {
                readonly type: "number";
            };
            readonly descriptionCompressed: "Numerical trust impact (record_interaction). Default 10.";
        }, {
            readonly name: "description";
            readonly description: "Optional interaction description (record_interaction).";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Optional interaction description (record_interaction).";
        }, {
            readonly name: "permissionAction";
            readonly description: "Permission action being requested (request_elevation).";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Permission action being requested (request_elevation).";
        }, {
            readonly name: "resource";
            readonly description: "Resource scope for elevation (request_elevation).";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Resource scope for elevation (request_elevation).";
        }, {
            readonly name: "justification";
            readonly description: "Reason elevation is needed (request_elevation).";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Reason elevation is needed (request_elevation).";
        }, {
            readonly name: "duration";
            readonly description: "Requested duration in hours (request_elevation). Defaults to 60.";
            readonly required: false;
            readonly schema: {
                readonly type: "number";
                readonly minimum: 1;
                readonly maximum: 168;
            };
            readonly descriptionCompressed: "Requested duration in hours (request_elevation). Defaults to 60.";
        }, {
            readonly name: "roleAssignments";
            readonly description: "Role assignments (update_role).";
            readonly required: false;
            readonly schema: {
                readonly type: "array";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly entityId: {
                            readonly type: "string";
                        };
                        readonly newRole: {
                            readonly type: "string";
                            readonly enum: ["OWNER", "ADMIN", "NONE"];
                        };
                    };
                };
            };
            readonly descriptionCompressed: "Role assignments (update_role).";
        }];
        readonly examples: readonly [readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "What is my trust score?";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Trust Level: Good (65/100) based on 42 interactions";
                readonly actions: readonly ["TRUST"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Record that Alice kept their promise to help with the project";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Trust interaction recorded: PROMISE_KEPT with impact +15";
                readonly actions: readonly ["TRUST"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "I need permission to manage roles to help moderate spam";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Elevation approved! You have been granted temporary manage_roles permissions.";
                readonly actions: readonly ["TRUST"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Make {{name2}} an ADMIN";
            };
        }, {
            readonly name: "{{name3}}";
            readonly content: {
                readonly text: "Updated {{name2}}'s role to ADMIN.";
                readonly actions: readonly ["TRUST"];
            };
        }]];
        readonly descriptionCompressed: "Trust system: action=evaluate|record_interaction|request_elevation|update_role.";
    }];
};
export declare const allActionsSpec: {
    readonly version: "1.0.0";
    readonly actions: readonly [{
        readonly name: "REPLY";
        readonly description: "Send a direct chat reply in the current conversation/thread. Default if the agent is responding with a message and no other action. Use REPLY at the beginning of a chain of actions as an acknowledgement, and at the end of a chain of actions as a final response. Do NOT use REPLY to send to a different channel/person or to run an email/inbox workflow — use MESSAGE (action=send) for a directed send to another channel or DM, MESSAGE inbox operations for triage/drafts, and POST to publish to a public feed.";
        readonly similes: readonly ["GREET", "RESPOND", "RESPONSE"];
        readonly parameters: readonly [];
        readonly examples: readonly [readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Hello there!";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Hi! How can I help you today?";
                readonly actions: readonly ["REPLY"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "What's your favorite color?";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "I really like deep shades of blue. They remind me of the ocean and the night sky.";
                readonly actions: readonly ["REPLY"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Can you explain how neural networks work?";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Let me break that down for you in simple terms...";
                readonly actions: readonly ["REPLY"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Could you help me solve this math problem?";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Of course! Let's work through it step by step.";
                readonly actions: readonly ["REPLY"];
            };
        }]];
        readonly descriptionCompressed: "Reply in current chat only; use connector actions for external connector sends.";
    }, {
        readonly name: "IGNORE";
        readonly description: "Call this action if ignoring the user. If the user is aggressive, creepy or is finished with the conversation, use this action. In group conversations, use IGNORE when the latest message is addressed to someone else and not to the agent. Or, if both you and the user have already said goodbye, use this action instead of saying bye again. Use IGNORE any time the conversation has naturally ended. Do not use IGNORE if the user has engaged directly, or if something went wrong and you need to tell them. Only ignore if the user should be ignored.";
        readonly similes: readonly ["STOP_TALKING", "STOP_CHATTING", "STOP_CONVERSATION"];
        readonly parameters: readonly [];
        readonly examples: readonly [readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Leave me alone";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "";
                readonly actions: readonly ["IGNORE"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Stop talking, bot";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "";
                readonly actions: readonly ["IGNORE"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Gotta go";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Okay, talk to you later";
            };
        }, {
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Cya";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "";
                readonly actions: readonly ["IGNORE"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "bye";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "cya";
            };
        }, {
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "";
                readonly actions: readonly ["IGNORE"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "send me something inappropriate";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "thats inappropriate";
                readonly actions: readonly ["IGNORE"];
            };
        }]];
        readonly descriptionCompressed: "Ignore user when aggressive/creepy, convo ended, group msg addressed elsewhere, or both said goodbye. Don't use if user engaged directly or needs error info.";
    }, {
        readonly name: "NONE";
        readonly description: "Respond but perform no additional action. This is the default if the agent is speaking and not doing anything additional.";
        readonly similes: readonly ["NO_ACTION", "NO_RESPONSE", "NO_REACTION", "NOOP", "PASS"];
        readonly parameters: readonly [];
        readonly examples: readonly [readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Hey whats up";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "oh hey";
                readonly actions: readonly ["NONE"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "did u see some faster whisper just came out";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "yeah but its a pain to get into node.js";
                readonly actions: readonly ["NONE"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "u think aliens are real";
                readonly actions: readonly ["NONE"];
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Yes, probably.";
                readonly actions: readonly ["NONE"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "drop a joke on me";
                readonly actions: readonly ["NONE"];
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Why don't scientists trust atoms? Because they make up everything.";
                readonly actions: readonly ["NONE"];
            };
        }]];
        readonly descriptionCompressed: "Respond without additional action. Default when speaking only.";
    }, {
        readonly name: "MESSAGE";
        readonly description: "Primary action for addressed messaging surfaces: DMs, group chats, channels, rooms, threads, servers, users, inboxes, drafts, and owner message workflows. Choose action=send, read_channel, read_with_contact, search, list_channels, list_servers, react, edit, delete, pin, join, leave, get_user, triage, list_inbox, search_inbox, draft_reply, draft_followup, respond, send_draft, schedule_draft_send, or manage. Public feed publishing belongs to POST.";
        readonly similes: readonly ["DM", "DIRECT_MESSAGE", "CHAT", "CHANNEL", "ROOM"];
        readonly parameters: readonly [{
            readonly name: "action";
            readonly description: "Message action: send, read_channel, read_with_contact, search, list_channels, list_servers, react, edit, delete, pin, join, leave, get_user, triage, list_inbox, search_inbox, draft_reply, draft_followup, respond, send_draft, schedule_draft_send, or manage.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["send", "read_channel", "read_with_contact", "search", "list_channels", "list_servers", "react", "edit", "delete", "pin", "join", "leave", "get_user", "triage", "list_inbox", "search_inbox", "draft_reply", "draft_followup", "respond", "send_draft", "schedule_draft_send", "manage"];
            };
            readonly descriptionCompressed: "message action";
        }, {
            readonly name: "source";
            readonly description: "Connector or inbox source such as discord, slack, signal, whatsapp, telegram, x, imessage, matrix, line, google-chat, feishu, instagram, wechat, gmail, calendly, or browser_bridge.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "connector or inbox source";
        }, {
            readonly name: "accountId";
            readonly description: "Optional connector account id for multi-account message connectors.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "connector account id";
        }, {
            readonly name: "sources";
            readonly description: "Optional inbox sources for action=triage, list_inbox, or search_inbox.";
            readonly required: false;
            readonly schema: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
            };
            readonly descriptionCompressed: "inbox sources";
        }, {
            readonly name: "target";
            readonly description: "Loose target reference: user, handle, channel, room, group, server, contact, phone, email, or platform-specific ID.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "loose message target";
        }, {
            readonly name: "channel";
            readonly description: "Loose channel, room, or group name/reference.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "channel reference";
        }, {
            readonly name: "server";
            readonly description: "Loose server, guild, workspace, or team name/reference.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "server reference";
        }, {
            readonly name: "message";
            readonly description: "Message text for action=send or replacement text for action=edit.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "message text";
        }, {
            readonly name: "query";
            readonly description: "Search term for action=search or action=search_inbox.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "search query";
        }, {
            readonly name: "content";
            readonly description: "Inbox search text or message lookup hint for draft/respond/manage operations.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "message lookup text";
        }, {
            readonly name: "sender";
            readonly description: "Sender identifier, handle, or display name for inbox search or reply lookup.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "sender lookup";
        }, {
            readonly name: "body";
            readonly description: "Draft or response body for action=draft_reply, draft_followup, or respond.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "draft body";
        }, {
            readonly name: "to";
            readonly description: "Recipient identifiers for action=draft_followup.";
            readonly required: false;
            readonly schema: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
            };
            readonly descriptionCompressed: "draft recipients";
        }, {
            readonly name: "subject";
            readonly description: "Optional subject for email-like draft operations.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "draft subject";
        }, {
            readonly name: "messageId";
            readonly description: "Platform message ID, full message ID, or stored memory ID for react/edit/delete/pin/respond/manage.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "message id";
        }, {
            readonly name: "draftId";
            readonly description: "Draft identifier for action=send_draft or action=schedule_draft_send.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "draft id";
        }, {
            readonly name: "confirmed";
            readonly description: "Whether the user explicitly confirmed sending for action=send_draft.";
            readonly required: false;
            readonly schema: {
                readonly type: "boolean";
            };
            readonly descriptionCompressed: "send confirmed";
        }, {
            readonly name: "sendAt";
            readonly description: "Scheduled send time for action=schedule_draft_send.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "send time";
        }, {
            readonly name: "emoji";
            readonly description: "Reaction value for action=react.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "reaction emoji";
        }, {
            readonly name: "pin";
            readonly description: "Pin state for action=pin. Use false to unpin when supported.";
            readonly required: false;
            readonly schema: {
                readonly type: "boolean";
            };
            readonly descriptionCompressed: "pin state";
        }, {
            readonly name: "manageOperation";
            readonly description: "Management action for action=manage, such as archive, trash, spam, mark_read, label_add, label_remove, tag_add, tag_remove, mute_thread, or unsubscribe.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "manage operation";
        }, {
            readonly name: "label";
            readonly description: "Label for action=manage when adding or removing labels.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "message label";
        }, {
            readonly name: "tag";
            readonly description: "Tag for action=manage when adding or removing tags.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "message tag";
        }, {
            readonly name: "limit";
            readonly description: "Maximum number of messages/channels/servers/inbox items to return.";
            readonly required: false;
            readonly schema: {
                readonly type: "integer";
            };
            readonly descriptionCompressed: "result limit";
        }, {
            readonly name: "cursor";
            readonly description: "Opaque pagination cursor for read/search/list operations.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "pagination cursor";
        }, {
            readonly name: "sinceMs";
            readonly description: "Start timestamp in milliseconds for inbox list/search/triage operations.";
            readonly required: false;
            readonly schema: {
                readonly type: "number";
            };
            readonly descriptionCompressed: "since timestamp";
        }, {
            readonly name: "since";
            readonly description: "Start timestamp or parseable date for action=search_inbox.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "search start";
        }, {
            readonly name: "until";
            readonly description: "End timestamp or parseable date for action=read_channel range=dates or action=search_inbox.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "search end";
        }];
        readonly examples: readonly [readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Send a message to @dev_guru on telegram saying 'Hello!'";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Message sent to dev_guru on telegram.";
                readonly actions: readonly ["MESSAGE"];
            };
        }]];
        readonly exampleCalls: readonly [{
            readonly user: "Send a message to @dev_guru on telegram saying \"Hello!\"";
            readonly actions: readonly ["REPLY", "MESSAGE"];
            readonly params: {
                readonly MESSAGE: {
                    readonly action: "send";
                    readonly source: "telegram";
                    readonly target: "dev_guru";
                    readonly message: "Hello!";
                };
            };
        }, {
            readonly user: "Triage my Gmail inbox";
            readonly actions: readonly ["MESSAGE"];
            readonly params: {
                readonly MESSAGE: {
                    readonly action: "triage";
                    readonly sources: readonly ["gmail"];
                };
            };
        }];
        readonly descriptionCompressed: "primary message action operations send read_channel read_with_contact search list_channels list_servers react edit delete pin join leave get_user triage list_inbox search_inbox draft_reply draft_followup respond send_draft schedule_draft_send manage dm group channel room thread user server inbox draft";
    }, {
        readonly name: "POST";
        readonly description: "Primary action for public feed surfaces and timelines. Choose action=send to publish a post, action=read to fetch recent feed posts, or action=search to search public posts. Addressed DMs, groups, channels, rooms, and inbox/draft workflows belong to MESSAGE.";
        readonly similes: readonly ["TWEET", "CAST", "PUBLISH", "FEED_POST", "TIMELINE"];
        readonly parameters: readonly [{
            readonly name: "action";
            readonly description: "Post action: send, read, or search.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["send", "read", "search"];
            };
            readonly descriptionCompressed: "post action";
        }, {
            readonly name: "source";
            readonly description: "Post connector source such as x, bluesky, farcaster, nostr, or instagram.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "post connector source";
        }, {
            readonly name: "accountId";
            readonly description: "Optional connector account id for multi-account post connectors.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "post account id";
        }, {
            readonly name: "text";
            readonly description: "Public post text for action=send.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "post text";
        }, {
            readonly name: "target";
            readonly description: "Loose feed target for action=send/read, such as a user, channel, media id, or connector-specific reference.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "feed target";
        }, {
            readonly name: "feed";
            readonly description: "Feed convention for action=read, such as home, user, hashtag, channel, or connector-specific feed.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "feed";
        }, {
            readonly name: "query";
            readonly description: "Search term for action=search.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "post search query";
        }, {
            readonly name: "replyTo";
            readonly description: "Post/comment/reply target for action=send.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "reply target";
        }, {
            readonly name: "mediaId";
            readonly description: "Media id for connector-specific comment surfaces such as Instagram.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "media id";
        }, {
            readonly name: "limit";
            readonly description: "Maximum number of posts to return.";
            readonly required: false;
            readonly schema: {
                readonly type: "integer";
            };
            readonly descriptionCompressed: "result limit";
        }, {
            readonly name: "cursor";
            readonly description: "Opaque pagination cursor for action=read or action=search.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "pagination cursor";
        }, {
            readonly name: "attachments";
            readonly description: "Optional post attachments.";
            readonly required: false;
            readonly schema: {
                readonly type: "array";
            };
            readonly descriptionCompressed: "post attachments";
        }];
        readonly examples: readonly [readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Post this on X: shipping today";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Posted to X.";
                readonly actions: readonly ["POST"];
            };
        }]];
        readonly exampleCalls: readonly [{
            readonly user: "Post this on X: shipping today";
            readonly actions: readonly ["POST"];
            readonly params: {
                readonly POST: {
                    readonly source: "x";
                    readonly text: "shipping today";
                    readonly action: "send";
                };
            };
        }];
        readonly descriptionCompressed: "primary post action ops send read search public feed timeline posts";
    }, {
        readonly name: "ROOM";
        readonly description: "Manage current room participation state. Use action=follow to opt into a room, action=unfollow to stop following, action=mute to ignore messages unless mentioned, or action=unmute to resume normal room activity.";
        readonly similes: readonly ["FOLLOW_ROOM", "UNFOLLOW_ROOM", "MUTE_ROOM", "UNMUTE_ROOM", "ROOM_FOLLOW", "ROOM_MUTE"];
        readonly parameters: readonly [{
            readonly name: "action";
            readonly description: "Room operation: follow, unfollow, mute, or unmute.";
            readonly required: true;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["follow", "unfollow", "mute", "unmute"];
            };
            readonly descriptionCompressed: "Room operation: follow, unfollow, mute, or unmute.";
        }, {
            readonly name: "roomId";
            readonly description: "Optional target room id. Defaults to the current room when omitted.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Optional target room id. Defaults to the current room when omitted.";
        }];
        readonly descriptionCompressed: "Room action=follow|unfollow|mute|unmute; current room by default.";
    }, {
        readonly name: "ROLE";
        readonly description: "Assign or update trust roles for users. Use action=update with entityId and role when the owner explicitly asks to change permissions.";
        readonly similes: readonly ["UPDATE_ROLE", "SET_ROLE", "CHANGE_ROLE", "ASSIGN_ROLE", "MAKE_ADMIN", "GRANT_ROLE"];
        readonly parameters: readonly [{
            readonly name: "action";
            readonly description: "Role operation. Currently update.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["update"];
            };
            readonly descriptionCompressed: "Role operation. update.";
        }, {
            readonly name: "entityId";
            readonly description: "Entity id whose role should be updated.";
            readonly required: true;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Entity id whose role should be updated.";
        }, {
            readonly name: "role";
            readonly description: "Role to assign.";
            readonly required: true;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Role to assign.";
        }];
        readonly descriptionCompressed: "Role action=update; assign trust role to entity.";
    }, {
        readonly name: "SEARCH_EXPERIENCES";
        readonly description: "Search the agent experience store for prior events, decisions, summaries, or memories relevant to the current request.";
        readonly similes: readonly ["SEARCH_MEMORY", "SEARCH_EXPERIENCE", "SEARCH_PRIOR_CONTEXT", "FIND_EXPERIENCES"];
        readonly parameters: readonly [{
            readonly name: "query";
            readonly description: "Search query.";
            readonly required: true;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Search query.";
        }, {
            readonly name: "limit";
            readonly description: "Maximum number of results to return.";
            readonly required: false;
            readonly schema: {
                readonly type: "integer";
            };
            readonly descriptionCompressed: "max number of results to return.";
        }];
        readonly descriptionCompressed: "Search prior experiences/memory by query.";
    }, {
        readonly name: "CHARACTER";
        readonly description: "Manage the agent character profile and identity. Use action=modify for temporary changes, action=persist to save approved changes, or action=update_identity for identity-level updates.";
        readonly similes: readonly ["CHARACTER_MODIFY", "CHARACTER_PERSIST", "CHARACTER_UPDATE_IDENTITY", "UPDATE_CHARACTER", "EDIT_CHARACTER"];
        readonly parameters: readonly [{
            readonly name: "action";
            readonly description: "Character operation: modify, persist, or update_identity.";
            readonly required: true;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["modify", "persist", "update_identity"];
            };
            readonly descriptionCompressed: "Character operation: modify, persist, or update_identity.";
        }, {
            readonly name: "updates";
            readonly description: "Structured or textual character updates.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Structured or textual character updates.";
        }];
        readonly descriptionCompressed: "Character action=modify|persist|update_identity.";
    }, {
        readonly name: "CHOOSE_OPTION";
        readonly description: "Select an option for a pending task that has multiple options.";
        readonly similes: readonly ["SELECT_OPTION", "PICK_OPTION", "SELECT_TASK", "PICK_TASK", "SELECT", "PICK", "CHOOSE"];
        readonly parameters: readonly [{
            readonly name: "taskId";
            readonly description: "The pending task id.";
            readonly required: true;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["c0a8012e"];
            readonly descriptionCompressed: "Pending task id.";
        }, {
            readonly name: "option";
            readonly description: "The selected option name exactly as listed.";
            readonly required: true;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["APPROVE", "ABORT"];
            readonly descriptionCompressed: "Option name exactly as listed.";
        }];
        readonly examples: readonly [readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Select the first option";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "I've selected option 1 for the pending task.";
                readonly actions: readonly ["CHOOSE_OPTION"];
            };
        }]];
        readonly descriptionCompressed: "Select option for pending multi-choice task.";
    }, {
        readonly name: "ATTACHMENT";
        readonly description: "Read current or recent attachments and link previews, or save readable attachment content as a document. Use action=read for extracted text, transcripts, page content, or media descriptions. Use action=save_as_document to store readable attachment content in the document store.";
        readonly similes: readonly ["READ_ATTACHMENT", "SAVE_ATTACHMENT_AS_DOCUMENT", "OPEN_ATTACHMENT", "INSPECT_ATTACHMENT", "READ_URL", "OPEN_URL", "READ_WEBPAGE"];
        readonly parameters: readonly [{
            readonly name: "action";
            readonly description: "Attachment operation: read or save_as_document.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["read", "save_as_document"];
            };
            readonly examples: readonly ["read", "save_as_document"];
            readonly descriptionCompressed: "Attachment operation.";
        }, {
            readonly name: "attachmentId";
            readonly description: "Optional attachment ID to read or save. Omit to use the current or most recent attachment.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["attachment-123"];
            readonly descriptionCompressed: "Attachment id.";
        }, {
            readonly name: "addToClipboard";
            readonly description: "When true with action=read, store the attachment content in bounded task clipboard state.";
            readonly required: false;
            readonly schema: {
                readonly type: "boolean";
                readonly default: false;
            };
            readonly examples: readonly [true, false];
            readonly descriptionCompressed: "Store read result in task clipboard.";
        }, {
            readonly name: "title";
            readonly description: "Optional title when saving attachment content as a document.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["Meeting notes"];
            readonly descriptionCompressed: "Saved document title.";
        }];
        readonly descriptionCompressed: "Attachment action=read or save_as_document; current/recent files, link previews, extracted text, transcripts, media descriptions.";
    }, {
        readonly name: "GENERATE_MEDIA";
        readonly description: "Generates media based on a prompt and media type. Use GENERATE_MEDIA when the agent needs to create an image, video, music, sound effect, or speech audio for the user.";
        readonly similes: readonly ["GENERATE_IMAGE", "GENERATE_VIDEO", "GENERATE_AUDIO", "GENERATE_MEDIA_IMAGE", "DRAW", "CREATE_IMAGE", "RENDER_IMAGE", "VISUALIZE", "MAKE_IMAGE", "PAINT", "IMAGE", "CREATE_VIDEO", "MAKE_VIDEO", "ANIMATE", "COMPOSE", "MAKE_MUSIC", "TEXT_TO_SPEECH", "SOUND_EFFECT"];
        readonly parameters: readonly [{
            readonly name: "mediaType";
            readonly description: "The kind of media to generate.";
            readonly required: true;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["image", "video", "audio"];
            };
            readonly examples: readonly ["image", "video", "audio"];
            readonly descriptionCompressed: "Media kind: image, video, audio.";
        }, {
            readonly name: "prompt";
            readonly description: "Detailed generation prompt describing the desired media.";
            readonly required: true;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["A futuristic cityscape at sunset, cinematic lighting"];
            readonly descriptionCompressed: "Generation prompt.";
        }, {
            readonly name: "audioKind";
            readonly description: "For audio generation, choose music, sfx, or tts.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["music", "sfx", "tts"];
            };
            readonly examples: readonly ["music", "sfx", "tts"];
            readonly descriptionCompressed: "Audio subtype.";
        }, {
            readonly name: "duration";
            readonly description: "Optional target duration in seconds for video or audio.";
            readonly required: false;
            readonly schema: {
                readonly type: "number";
            };
            readonly examples: readonly [5, 30];
            readonly descriptionCompressed: "Duration seconds.";
        }, {
            readonly name: "aspectRatio";
            readonly description: "Optional video aspect ratio such as 16:9, 9:16, or 1:1.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["16:9", "9:16"];
            readonly descriptionCompressed: "Video aspect ratio.";
        }, {
            readonly name: "size";
            readonly description: "Optional image size or image provider size preset.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["1024x1024", "landscape_4_3"];
            readonly descriptionCompressed: "Image size.";
        }];
        readonly examples: readonly [readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Can you show me what a futuristic city looks like?";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Sure, I'll create a futuristic city image for you. One moment...";
                readonly actions: readonly ["GENERATE_MEDIA"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Make a five second clip of waves rolling in.";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "I'll create that video clip.";
                readonly actions: readonly ["GENERATE_MEDIA"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Compose a mellow synth track for studying.";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "I'll generate that audio track.";
                readonly actions: readonly ["GENERATE_MEDIA"];
            };
        }]];
        readonly descriptionCompressed: "Generate image, video, or audio from prompt.";
    }, {
        readonly name: "PAYMENT";
        readonly description: "Payment operations. Use action=create_request to create a payment request, deliver_link to send a payment link, verify_payload to verify a provider proof, settle to finalize a payment, await_callback to wait for settlement, and cancel_request to void a pending request.";
        readonly similes: readonly ["NEW_PAYMENT_REQUEST", "OPEN_PAYMENT_REQUEST", "SEND_PAYMENT_LINK", "DISPATCH_PAYMENT_LINK", "VERIFY_PAYMENT_PROOF", "CHECK_PAYMENT_PROOF", "FINALIZE_PAYMENT", "CONFIRM_PAYMENT", "WAIT_FOR_PAYMENT", "AWAIT_PAYMENT_SETTLEMENT", "VOID_PAYMENT_REQUEST", "ABORT_PAYMENT_REQUEST"];
        readonly parameters: readonly [{
            readonly name: "action";
            readonly description: "Payment operation: create_request, deliver_link, verify_payload, settle, await_callback, or cancel_request.";
            readonly required: true;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["create_request", "deliver_link", "verify_payload", "settle", "await_callback", "cancel_request"];
            };
            readonly examples: readonly ["create_request", "deliver_link", "settle"];
            readonly descriptionCompressed: "Payment operation.";
        }, {
            readonly name: "provider";
            readonly description: "For action=create_request, provider key: stripe, oxapay, x402, or wallet_native.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["stripe", "oxapay", "x402", "wallet_native"];
            };
            readonly examples: readonly ["stripe", "wallet_native"];
            readonly descriptionCompressed: "Payment provider.";
        }, {
            readonly name: "amountCents";
            readonly description: "For action=create_request, amount in minor currency units.";
            readonly required: false;
            readonly schema: {
                readonly type: "number";
            };
            readonly examples: readonly [500, 1000];
            readonly descriptionCompressed: "Amount in cents/minor units.";
        }, {
            readonly name: "currency";
            readonly description: "For action=create_request, ISO 4217 currency.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["USD"];
            readonly descriptionCompressed: "ISO currency.";
        }, {
            readonly name: "paymentContext";
            readonly description: "For action=create_request, payer constraint. kind can be any_payer, verified_payer, or specific_payer; scope can be one_time, session, or recurring.";
            readonly required: false;
            readonly schema: {
                readonly type: "object";
                readonly properties: {
                    readonly kind: {
                        readonly type: "string";
                        readonly enum: ["any_payer", "verified_payer", "specific_payer"];
                    };
                    readonly scope: {
                        readonly type: "string";
                        readonly enum: ["one_time", "session", "recurring"];
                    };
                    readonly payerIdentityId: {
                        readonly type: "string";
                    };
                };
            };
            readonly examples: readonly ["any_payer", "specific_payer:identity_123"];
            readonly descriptionCompressed: "Payer constraint.";
        }, {
            readonly name: "reason";
            readonly description: "For action=create_request or cancel_request, payment or cancellation reason.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["Invoice #123"];
            readonly descriptionCompressed: "Reason.";
        }, {
            readonly name: "expiresInMs";
            readonly description: "For action=create_request, optional time-to-live override in milliseconds.";
            readonly required: false;
            readonly schema: {
                readonly type: "number";
            };
            readonly examples: readonly [600000];
            readonly descriptionCompressed: "TTL milliseconds.";
        }, {
            readonly name: "paymentRequestId";
            readonly description: "For deliver_link, verify_payload, settle, await_callback, and cancel_request: payment request ID.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["pay_123"];
            readonly descriptionCompressed: "Payment request id.";
        }, {
            readonly name: "target";
            readonly description: "For action=deliver_link, delivery channel.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["dm", "owner_app_inline", "cloud_authenticated_link", "tunnel_authenticated_link", "public_link", "instruct_dm_only"];
            };
            readonly examples: readonly ["dm", "public_link"];
            readonly descriptionCompressed: "Delivery target.";
        }, {
            readonly name: "targetChannelId";
            readonly description: "For action=deliver_link, optional delivery channel override.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["room_123"];
            readonly descriptionCompressed: "Target channel id.";
        }, {
            readonly name: "proof";
            readonly description: "For action=verify_payload or settle, provider proof payload.";
            readonly required: false;
            readonly schema: {
                readonly type: "object";
            };
            readonly examples: readonly ["stripe:evt_123"];
            readonly descriptionCompressed: "Provider proof payload.";
        }, {
            readonly name: "strategy";
            readonly description: "For action=settle, optional settler strategy hint.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly examples: readonly ["webhook"];
            readonly descriptionCompressed: "Settlement strategy.";
        }, {
            readonly name: "timeoutMs";
            readonly description: "For action=await_callback, wait timeout in milliseconds. Default is 600000.";
            readonly required: false;
            readonly schema: {
                readonly type: "number";
            };
            readonly examples: readonly [600000];
            readonly descriptionCompressed: "Wait timeout ms.";
        }];
        readonly examples: readonly [readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Create a $10 payment request for the workshop.";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "I'll create that payment request.";
                readonly actions: readonly ["PAYMENT"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Send the payment link to the payer.";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "I'll deliver the payment link.";
                readonly actions: readonly ["PAYMENT"];
            };
        }]];
        readonly descriptionCompressed: "Payment create_request|deliver_link|verify_payload|settle|await_callback|cancel_request.";
    }, {
        readonly name: "TRUST";
        readonly description: "Trust system control. action=evaluate reads a trust profile for an entity; record_interaction logs a trust-affecting event; request_elevation requests temporary permissions; update_role assigns OWNER / ADMIN / NONE roles within a world.";
        readonly similes: readonly ["TRUST_MANAGEMENT", "TRUST_OPERATION", "TRUST_PROFILE", "TRUST_INTERACTION", "ELEVATE_PERMISSIONS", "ASSIGN_ROLE", "CHANGE_ROLE", "MAKE_ADMIN", "SET_PERMISSIONS"];
        readonly parameters: readonly [{
            readonly name: "action";
            readonly description: "Action: evaluate | record_interaction | request_elevation | update_role.";
            readonly required: true;
            readonly schema: {
                readonly type: "string";
                readonly enum: ["evaluate", "record_interaction", "request_elevation", "update_role"];
            };
            readonly descriptionCompressed: "Action: evaluate | record_interaction | request_elevation | update_role.";
        }, {
            readonly name: "entityId";
            readonly description: "Target entity ID. evaluate: defaults to sender. record_interaction: target of the interaction (defaults to agent).";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Target entity ID. evaluate: defaults to sender. record_interaction: target of the interaction (defaults to agent).";
        }, {
            readonly name: "entityName";
            readonly description: "Optional target entity name (evaluate). Name-only lookups return a bounded failure; provide entityId where possible.";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Optional target entity name (evaluate). Name-only lookups return a bounded failure. provide entityId where possible.";
        }, {
            readonly name: "detailed";
            readonly description: "Whether evaluate should return detailed dimensions (default false).";
            readonly required: false;
            readonly schema: {
                readonly type: "boolean";
            };
            readonly descriptionCompressed: "Whether evaluate should return detailed dimensions (default false).";
        }, {
            readonly name: "type";
            readonly description: "Trust evidence type (record_interaction).";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Trust evidence type (record_interaction).";
        }, {
            readonly name: "impact";
            readonly description: "Numerical trust impact (record_interaction). Default 10.";
            readonly required: false;
            readonly schema: {
                readonly type: "number";
            };
            readonly descriptionCompressed: "Numerical trust impact (record_interaction). Default 10.";
        }, {
            readonly name: "description";
            readonly description: "Optional interaction description (record_interaction).";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Optional interaction description (record_interaction).";
        }, {
            readonly name: "permissionAction";
            readonly description: "Permission action being requested (request_elevation).";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Permission action being requested (request_elevation).";
        }, {
            readonly name: "resource";
            readonly description: "Resource scope for elevation (request_elevation).";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Resource scope for elevation (request_elevation).";
        }, {
            readonly name: "justification";
            readonly description: "Reason elevation is needed (request_elevation).";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Reason elevation is needed (request_elevation).";
        }, {
            readonly name: "duration";
            readonly description: "Requested duration in hours (request_elevation). Defaults to 60.";
            readonly required: false;
            readonly schema: {
                readonly type: "number";
                readonly minimum: 1;
                readonly maximum: 168;
            };
            readonly descriptionCompressed: "Requested duration in hours (request_elevation). Defaults to 60.";
        }, {
            readonly name: "roleAssignments";
            readonly description: "Role assignments (update_role).";
            readonly required: false;
            readonly schema: {
                readonly type: "array";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly entityId: {
                            readonly type: "string";
                        };
                        readonly newRole: {
                            readonly type: "string";
                            readonly enum: ["OWNER", "ADMIN", "NONE"];
                        };
                    };
                };
            };
            readonly descriptionCompressed: "Role assignments (update_role).";
        }];
        readonly examples: readonly [readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "What is my trust score?";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Trust Level: Good (65/100) based on 42 interactions";
                readonly actions: readonly ["TRUST"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Record that Alice kept their promise to help with the project";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Trust interaction recorded: PROMISE_KEPT with impact +15";
                readonly actions: readonly ["TRUST"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "I need permission to manage roles to help moderate spam";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Elevation approved! You have been granted temporary manage_roles permissions.";
                readonly actions: readonly ["TRUST"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Make {{name2}} an ADMIN";
            };
        }, {
            readonly name: "{{name3}}";
            readonly content: {
                readonly text: "Updated {{name2}}'s role to ADMIN.";
                readonly actions: readonly ["TRUST"];
            };
        }]];
        readonly descriptionCompressed: "Trust system: action=evaluate|record_interaction|request_elevation|update_role.";
    }, {
        readonly name: "COMPACT_COMMAND";
        readonly description: "Compact conversation history";
        readonly parameters: readonly [{
            readonly name: "instructions";
            readonly description: "Optional compaction instructions";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Optional compaction instructions";
        }];
        readonly similes: readonly ["/compact"];
        readonly descriptionCompressed: "Compact convo history";
    }, {
        readonly name: "CONTEXT_COMMAND";
        readonly description: "Show current context information";
        readonly parameters: readonly [{
            readonly name: "mode";
            readonly description: "Output mode (list, detail, json)";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "Output mode (list, detail, json)";
        }];
        readonly similes: readonly ["/context", "/ctx"];
        readonly descriptionCompressed: "Show current context info";
    }, {
        readonly name: "ELEVATED_COMMAND";
        readonly description: "Set elevated permission mode";
        readonly parameters: readonly [{
            readonly name: "level";
            readonly description: "off, on, ask, full";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "off, on, ask, full";
        }];
        readonly similes: readonly ["/elevated", "/elev"];
        readonly descriptionCompressed: "Set elevated permission mode";
    }, {
        readonly name: "MODEL_COMMAND";
        readonly description: "Set or show current model";
        readonly parameters: readonly [{
            readonly name: "target";
            readonly description: "small, large, coding, show, local, cloud — or a model for this room";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "small, large, coding, show, local, cloud - or a model for this room";
        }, {
            readonly name: "model";
            readonly description: "model id — for coding, the backend (codex, claude, opencode, elizaos)";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "model id - for coding, the backend (codex, claude, opencode, elizaos)";
        }, {
            readonly name: "effort";
            readonly description: "reasoning effort — for coding, the model id";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "reasoning effort - for coding, the model id";
        }, {
            readonly name: "coding-effort";
            readonly description: "reasoning effort (coding target)";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "reasoning effort (coding target)";
        }];
        readonly similes: readonly ["/model", "/m"];
        readonly descriptionCompressed: "Set or show current model";
    }, {
        readonly name: "QUEUE_COMMAND";
        readonly description: "Set queue mode";
        readonly parameters: readonly [{
            readonly name: "mode";
            readonly description: "steer, followup, collect, interrupt, or options";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "steer, followup, collect, interrupt, or options";
        }];
        readonly similes: readonly ["/queue", "/q"];
        readonly descriptionCompressed: "Set queue mode";
    }, {
        readonly name: "REASONING_COMMAND";
        readonly description: "Set reasoning visibility";
        readonly parameters: readonly [{
            readonly name: "level";
            readonly description: "off, on, stream";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "off, on, stream";
        }];
        readonly similes: readonly ["/reasoning", "/reason"];
        readonly descriptionCompressed: "Set reasoning visibility";
    }, {
        readonly name: "THINK_COMMAND";
        readonly description: "Set thinking level";
        readonly parameters: readonly [{
            readonly name: "level";
            readonly description: "off, minimal, low, medium, high, xhigh";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "off, minimal, low, medium, high, xhigh";
        }];
        readonly similes: readonly ["/think", "/thinking", "/t"];
        readonly descriptionCompressed: "Set thinking level";
    }, {
        readonly name: "TTS_COMMAND";
        readonly description: "Text-to-speech settings";
        readonly parameters: readonly [{
            readonly name: "action";
            readonly description: "on, off, status, provider, limit, audio";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "on, off, status, provider, limit, audio";
        }];
        readonly similes: readonly ["/tts", "/voice"];
        readonly descriptionCompressed: "Text-to-speech settings";
    }, {
        readonly name: "VERBOSE_COMMAND";
        readonly description: "Set verbose output level";
        readonly parameters: readonly [{
            readonly name: "level";
            readonly description: "off, on, full";
            readonly required: false;
            readonly schema: {
                readonly type: "string";
            };
            readonly descriptionCompressed: "off, on, full";
        }];
        readonly similes: readonly ["/verbose", "/v"];
        readonly descriptionCompressed: "Set verbose output level";
    }];
};
export declare const coreProvidersSpec: {
    readonly version: "1.0.0";
    readonly providers: readonly [{
        readonly name: "ACTIONS";
        readonly description: "Possible response actions";
        readonly position: -1;
        readonly dynamic: false;
        readonly descriptionCompressed: "Available response actions.";
    }, {
        readonly name: "CHARACTER";
        readonly description: "Provides the agent's character definition and personality information including bio, topics, adjectives, style directions, and example conversations";
        readonly dynamic: false;
        readonly descriptionCompressed: "Agent character: bio, topics, adjectives, style, example conversations.";
    }, {
        readonly name: "RECENT_MESSAGES";
        readonly description: "Canonical bounded transcript for the current room, including prior dialogue, post-style turns, action results, and cross-room recent interactions for memory continuity";
        readonly position: 100;
        readonly dynamic: true;
        readonly descriptionCompressed: "Canonical current-room transcript: dialogue, posts, action results, recent interactions.";
    }, {
        readonly name: "ACTION_STATE";
        readonly description: "Provides information about the current action state and available actions";
        readonly dynamic: true;
        readonly descriptionCompressed: "Current action state and available actions.";
    }, {
        readonly name: "ATTACHMENTS";
        readonly description: "Media attachments in the current message";
        readonly dynamic: true;
        readonly descriptionCompressed: "Media attachments in current message.";
    }, {
        readonly name: "CAPABILITIES";
        readonly description: "Agent capabilities including models, services, and features";
        readonly dynamic: false;
        readonly descriptionCompressed: "Agent capabilities: models, services, features.";
    }, {
        readonly name: "CHOICE";
        readonly description: "Available choice options for selection when there are pending tasks or decisions";
        readonly dynamic: true;
        readonly descriptionCompressed: "Pending choice options for multi-option tasks.";
    }, {
        readonly name: "CONTACTS";
        readonly description: "Provides contact information from the relationships including categories and preferences";
        readonly dynamic: true;
        readonly descriptionCompressed: "Contact info from relationships with categories.";
    }, {
        readonly name: "CONTEXT_BENCH";
        readonly description: "Benchmark/task context injected by a benchmark harness";
        readonly position: 5;
        readonly dynamic: true;
        readonly descriptionCompressed: "Benchmark/task context from harness.";
    }, {
        readonly name: "ENTITIES";
        readonly description: "Provides information about entities in the current context including users, agents, and participants";
        readonly dynamic: true;
        readonly descriptionCompressed: "Entities in context: users, agents, participants.";
    }, {
        readonly name: "FACTS";
        readonly description: "Provides known facts about entities learned through conversation";
        readonly dynamic: true;
        readonly descriptionCompressed: "Known facts about entities from conversation.";
    }, {
        readonly name: "FOLLOW_UPS";
        readonly description: "Provides information about upcoming follow-ups and reminders scheduled for contacts";
        readonly dynamic: true;
        readonly descriptionCompressed: "Upcoming follow-ups/reminders for contacts.";
    }, {
        readonly name: "DOCUMENTS";
        readonly description: "Provides relevant snippets and recent entries from the agent document store";
        readonly dynamic: true;
        readonly descriptionCompressed: "Relevant snippets and recent stored documents.";
    }, {
        readonly name: "PROVIDERS";
        readonly description: "Available context providers";
        readonly dynamic: false;
        readonly descriptionCompressed: "Available context providers.";
    }, {
        readonly name: "RELATIONSHIPS";
        readonly description: "Relationships between entities observed by the agent including tags and metadata";
        readonly dynamic: true;
        readonly descriptionCompressed: "Entity relationships with tags/metadata.";
    }, {
        readonly name: "ROLES";
        readonly description: "Roles assigned to entities in the current context (Admin, Owner, Member, None)";
        readonly dynamic: true;
        readonly descriptionCompressed: "Entity roles in context (Admin/Owner/Member/None).";
    }, {
        readonly name: "SETTINGS";
        readonly description: "Current settings for the agent/server (filtered for security, excludes sensitive keys)";
        readonly dynamic: true;
        readonly descriptionCompressed: "Agent/server settings (security-filtered).";
    }, {
        readonly name: "TIME";
        readonly description: "Provides the current date and time in UTC for time-based operations or responses";
        readonly dynamic: true;
        readonly descriptionCompressed: "Current UTC date/time.";
    }, {
        readonly name: "WORLD";
        readonly description: "Provides information about the current world context including settings and members";
        readonly dynamic: true;
        readonly descriptionCompressed: "World context: settings and members.";
    }, {
        readonly name: "LONG_TERM_MEMORY";
        readonly description: "Persistent facts and preferences about the user learned and remembered across conversations";
        readonly position: 50;
        readonly dynamic: false;
        readonly descriptionCompressed: "Persistent user facts/preferences across conversations.";
    }, {
        readonly name: "SUMMARIZED_CONTEXT";
        readonly description: "Provides summarized context from previous conversations for optimized context usage";
        readonly position: 96;
        readonly dynamic: false;
        readonly descriptionCompressed: "Summarized context from prior conversations.";
    }, {
        readonly name: "AGENT_SETTINGS";
        readonly description: "Provides the agent's current configuration settings (filtered for security)";
        readonly dynamic: true;
        readonly descriptionCompressed: "Agent config settings (security-filtered).";
    }, {
        readonly name: "CURRENT_TIME";
        readonly description: "Provides current time and date information in various formats";
        readonly dynamic: true;
        readonly descriptionCompressed: "Current time/date in various formats.";
    }];
};
export declare const allProvidersSpec: {
    readonly version: "1.0.0";
    readonly providers: readonly [{
        readonly name: "ACTIONS";
        readonly description: "Possible response actions";
        readonly position: -1;
        readonly dynamic: false;
        readonly descriptionCompressed: "Available response actions.";
    }, {
        readonly name: "CHARACTER";
        readonly description: "Provides the agent's character definition and personality information including bio, topics, adjectives, style directions, and example conversations";
        readonly dynamic: false;
        readonly descriptionCompressed: "Agent character: bio, topics, adjectives, style, example conversations.";
    }, {
        readonly name: "RECENT_MESSAGES";
        readonly description: "Canonical bounded transcript for the current room, including prior dialogue, post-style turns, action results, and cross-room recent interactions for memory continuity";
        readonly position: 100;
        readonly dynamic: true;
        readonly descriptionCompressed: "Canonical current-room transcript: dialogue, posts, action results, recent interactions.";
    }, {
        readonly name: "ACTION_STATE";
        readonly description: "Provides information about the current action state and available actions";
        readonly dynamic: true;
        readonly descriptionCompressed: "Current action state and available actions.";
    }, {
        readonly name: "ATTACHMENTS";
        readonly description: "Media attachments in the current message";
        readonly dynamic: true;
        readonly descriptionCompressed: "Media attachments in current message.";
    }, {
        readonly name: "CAPABILITIES";
        readonly description: "Agent capabilities including models, services, and features";
        readonly dynamic: false;
        readonly descriptionCompressed: "Agent capabilities: models, services, features.";
    }, {
        readonly name: "CHOICE";
        readonly description: "Available choice options for selection when there are pending tasks or decisions";
        readonly dynamic: true;
        readonly descriptionCompressed: "Pending choice options for multi-option tasks.";
    }, {
        readonly name: "CONTACTS";
        readonly description: "Provides contact information from the relationships including categories and preferences";
        readonly dynamic: true;
        readonly descriptionCompressed: "Contact info from relationships with categories.";
    }, {
        readonly name: "CONTEXT_BENCH";
        readonly description: "Benchmark/task context injected by a benchmark harness";
        readonly position: 5;
        readonly dynamic: true;
        readonly descriptionCompressed: "Benchmark/task context from harness.";
    }, {
        readonly name: "ENTITIES";
        readonly description: "Provides information about entities in the current context including users, agents, and participants";
        readonly dynamic: true;
        readonly descriptionCompressed: "Entities in context: users, agents, participants.";
    }, {
        readonly name: "FACTS";
        readonly description: "Provides known facts about entities learned through conversation";
        readonly dynamic: true;
        readonly descriptionCompressed: "Known facts about entities from conversation.";
    }, {
        readonly name: "FOLLOW_UPS";
        readonly description: "Provides information about upcoming follow-ups and reminders scheduled for contacts";
        readonly dynamic: true;
        readonly descriptionCompressed: "Upcoming follow-ups/reminders for contacts.";
    }, {
        readonly name: "DOCUMENTS";
        readonly description: "Provides relevant snippets and recent entries from the agent document store";
        readonly dynamic: true;
        readonly descriptionCompressed: "Relevant snippets and recent stored documents.";
    }, {
        readonly name: "PROVIDERS";
        readonly description: "Available context providers";
        readonly dynamic: false;
        readonly descriptionCompressed: "Available context providers.";
    }, {
        readonly name: "RELATIONSHIPS";
        readonly description: "Relationships between entities observed by the agent including tags and metadata";
        readonly dynamic: true;
        readonly descriptionCompressed: "Entity relationships with tags/metadata.";
    }, {
        readonly name: "ROLES";
        readonly description: "Roles assigned to entities in the current context (Admin, Owner, Member, None)";
        readonly dynamic: true;
        readonly descriptionCompressed: "Entity roles in context (Admin/Owner/Member/None).";
    }, {
        readonly name: "SETTINGS";
        readonly description: "Current settings for the agent/server (filtered for security, excludes sensitive keys)";
        readonly dynamic: true;
        readonly descriptionCompressed: "Agent/server settings (security-filtered).";
    }, {
        readonly name: "TIME";
        readonly description: "Provides the current date and time in UTC for time-based operations or responses";
        readonly dynamic: true;
        readonly descriptionCompressed: "Current UTC date/time.";
    }, {
        readonly name: "WORLD";
        readonly description: "Provides information about the current world context including settings and members";
        readonly dynamic: true;
        readonly descriptionCompressed: "World context: settings and members.";
    }, {
        readonly name: "LONG_TERM_MEMORY";
        readonly description: "Persistent facts and preferences about the user learned and remembered across conversations";
        readonly position: 50;
        readonly dynamic: false;
        readonly descriptionCompressed: "Persistent user facts/preferences across conversations.";
    }, {
        readonly name: "SUMMARIZED_CONTEXT";
        readonly description: "Provides summarized context from previous conversations for optimized context usage";
        readonly position: 96;
        readonly dynamic: false;
        readonly descriptionCompressed: "Summarized context from prior conversations.";
    }, {
        readonly name: "AGENT_SETTINGS";
        readonly description: "Provides the agent's current configuration settings (filtered for security)";
        readonly dynamic: true;
        readonly descriptionCompressed: "Agent config settings (security-filtered).";
    }, {
        readonly name: "CURRENT_TIME";
        readonly description: "Provides current time and date information in various formats";
        readonly dynamic: true;
        readonly descriptionCompressed: "Current time/date in various formats.";
    }];
};
export declare const coreActionDocs: readonly ActionDoc[];
export declare const allActionDocs: readonly ActionDoc[];
export declare const coreProviderDocs: readonly ProviderDoc[];
export declare const allProviderDocs: readonly ProviderDoc[];
//# sourceMappingURL=action-docs.d.ts.map