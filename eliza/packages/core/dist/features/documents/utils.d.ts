/**
 * Pure helpers for the documents capability: extracting text from file buffers
 * (DOCX via mammoth, PDF via unpdf, plain text plus a UTF-8 fallback),
 * classifying content types as binary vs text, deriving document titles and safe
 * ASCII note filenames, normalizing source labels and S3 URLs, detecting base64
 * payloads, and computing a stable content-based UUID used as the document
 * dedupe key. Consumed by `service.ts` and the document processors.
 */
import { Buffer } from "node:buffer";
export declare function extractTextFromFileBuffer(fileBuffer: Buffer, contentType: string, originalFilename: string): Promise<string>;
export declare function convertPdfToTextFromBuffer(pdfBuffer: Buffer, _filename?: string): Promise<string>;
export declare function isBinaryContentType(contentType: string, filename: string): boolean;
export declare function stripDocumentFilenameExtension(filename: string): string;
export declare function deriveDocumentTitle(content: string, fallback?: string): string;
export declare function createDocumentNoteFilename(title: string, extension?: string): string;
export declare function isTextBackedDocumentContent(contentType: string, filename: string): boolean;
export declare function normalizeDocumentSourceValue(source: unknown): "upload" | "learned" | "character" | "url" | "youtube" | "bundled" | "unknown";
export declare function normalizeS3Url(url: string): string;
export declare function looksLikeBase64(content?: string | null): boolean;
export declare function generateContentBasedId(content: string, agentId: string, options?: {
    maxChars?: number;
    includeFilename?: string;
    contentType?: string;
}): string;
export declare function extractFirstLines(content: string, maxLines?: number): string;
//# sourceMappingURL=utils.d.ts.map