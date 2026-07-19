/**
 * Keyword and regex matchers over recent message history, used by action
 * `validate()` paths to gate on message content. Both scan the current message
 * plus the last five recent messages; keyword matching is case-insensitive.
 */
import type { Memory } from "../types/index.js";
/**
 * Validates if any of the given keywords are present in the recent message history.
 *
 * This function checks the current message content and the last 5 messages in the provided
 * list for the presence of any of the provided keywords. The check is case-insensitive.
 *
 * @param message The current message memory
 * @param recentMessages List of recent memories
 * @param keywords List of keywords to check for
 * @returns true if any keyword matches, false otherwise
 */
export declare function validateActionKeywords(message: Memory, recentMessages: Memory[], keywords: string[]): boolean;
/**
 * Validates if any of the recent message history matches the given regex.
 *
 * This function checks the current message content and the last 5 messages in the provided
 * list against the provided regex pattern.
 *
 * @param message The current message memory
 * @param recentMessages List of recent memories
 * @param regex The regular expression to check against
 * @returns true if the regex matches any message content, false otherwise
 */
export declare function validateActionRegex(message: Memory, recentMessages: Memory[], regex: RegExp): boolean;
//# sourceMappingURL=keywords.d.ts.map