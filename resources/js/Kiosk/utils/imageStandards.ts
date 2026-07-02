export const IMAGE_STANDARDS = {
    categoryCard: {
        displayHeight: 420,
        recommendedWidth: 1200,
        recommendedHeight: 800,
        fit: 'cover' as const,
    },
    subCategoryCard: {
        displayHeight: 300,
        recommendedWidth: 1200,
        recommendedHeight: 800,
        fit: 'cover' as const,
    },
    variationTabCard: {
        displayWidth: 183,
        displayHeight: 120,
        recommendedWidth: 900,
        recommendedHeight: 600,
        fit: 'cover' as const,
    },
    productCard: {
        displayRatio: '1:1',
        recommendedWidth: 1200,
        recommendedHeight: 1200,
        fit: 'contain' as const,
    },
    productMainImage: {
        displayRatio: '1:1',
        recommendedWidth: 1200,
        recommendedHeight: 1200,
        fit: 'contain' as const,
    },
    productThumbnail: {
        displayWidth: 120,
        displayHeight: 120,
        recommendedWidth: 1200,
        recommendedHeight: 1200,
        fit: 'contain' as const,
    },
    variantThumbnail: {
        displayWidth: 150,
        displayHeight: 100,
        recommendedWidth: 1200,
        recommendedHeight: 1200,
        fit: 'contain' as const,
    },
    adminTablePreview: {
        displayWidth: 48,
        displayHeight: 48,
        fit: 'cover' as const,
    },
    adminUploaderThumb: {
        displayWidth: 90,
        displayHeight: 90,
        fit: 'cover' as const,
    },
} as const;

export const IMAGE_GUIDE = {
    categoryUpload: `${IMAGE_STANDARDS.categoryCard.recommendedWidth}x${IMAGE_STANDARDS.categoryCard.recommendedHeight}`,
    subCategoryUpload: `${IMAGE_STANDARDS.subCategoryCard.recommendedWidth}x${IMAGE_STANDARDS.subCategoryCard.recommendedHeight}`,
    variationTabUpload: `${IMAGE_STANDARDS.variationTabCard.recommendedWidth}x${IMAGE_STANDARDS.variationTabCard.recommendedHeight}`,
    productUpload: `${IMAGE_STANDARDS.productCard.recommendedWidth}x${IMAGE_STANDARDS.productCard.recommendedHeight}`,
    variantUpload: `${IMAGE_STANDARDS.productMainImage.recommendedWidth}x${IMAGE_STANDARDS.productMainImage.recommendedHeight}`,
} as const;
