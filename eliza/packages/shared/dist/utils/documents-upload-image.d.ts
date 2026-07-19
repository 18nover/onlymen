/**
 * Client-side image preparation for document uploads: types and helpers to
 * compress/resize an image `File` through an injected platform canvas provider
 * before upload. The platform abstraction keeps this usable in browser and native.
 */
export type DocumentImageUploadFile = File & {
    webkitRelativePath?: string;
};
export type DocumentImageCompressionPlatform = {
    isAvailable: () => boolean;
    loadImageSource: (file: File) => Promise<{
        source: CanvasImageSource;
        width: number;
        height: number;
    }>;
    renderBlob: (input: {
        source: CanvasImageSource;
        width: number;
        height: number;
        outputType: string;
        quality: number;
    }) => Promise<Blob>;
};
export declare const MAX_DOCUMENT_IMAGE_PROCESSING_BYTES: number;
export declare function isDocumentImageFile(file: Pick<File, "name" | "type">): boolean;
export declare function maybeCompressDocumentUploadImage(file: DocumentImageUploadFile, platform?: DocumentImageCompressionPlatform): Promise<{
    file: DocumentImageUploadFile;
    optimized: boolean;
    originalSize: number;
    optimizedSize: number;
}>;
//# sourceMappingURL=documents-upload-image.d.ts.map