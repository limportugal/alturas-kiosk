import imageCompression from 'browser-image-compression';

type CompressionImageOptions = {
    maxWidthOrHeight?: number;
    maxSizeMB?: number;
    fileType?: string;
};

export const compressionImage = async (
    imageFile: File,
    options?: CompressionImageOptions
): Promise<File> => {
    const compressedBlob = await imageCompression(imageFile, {
        maxWidthOrHeight: options?.maxWidthOrHeight ?? 500,
        maxSizeMB: options?.maxSizeMB ?? 0.3,
        useWebWorker: true,
        fileType: options?.fileType ?? 'image/png',
    });
    
    return new File(
        [compressedBlob],
        imageFile.name.replace(/\.[^/.]+$/, '.png'),
        { 
            type: options?.fileType ?? 'image/png',
            lastModified: Date.now(),
         }
    );
};
