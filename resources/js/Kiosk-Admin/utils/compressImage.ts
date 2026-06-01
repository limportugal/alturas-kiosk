import imageCompression from 'browser-image-compression';
import { option } from 'framer-motion/client';

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
        fileType: options?.fileType ?? 'image/webp',
    });
    
    return new File(
        [compressedBlob],
        imageFile.name.replace(/\.[^/.]+$/, '.webp'),
        { 
            type: options?.fileType ?? 'image/webp',
            lastModified: Date.now(),
         }
    );
};