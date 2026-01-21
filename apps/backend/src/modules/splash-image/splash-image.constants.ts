/**
 * Supported aspect ratios for splash images
 */
export const ASPECT_RATIOS = {
  RATIO_9_16: '9:16',
  RATIO_9_19_5: '9:19.5',
  RATIO_9_20: '9:20',
  RATIO_9_18: '9:18',
  RATIO_9_21: '9:21',
  RATIO_9_19: '9:19',
} as const;

/**
 * Default splash image configurations for different device types
 */
export const DEFAULT_SPLASH_IMAGES = [
  {
    aspectRatio: ASPECT_RATIOS.RATIO_9_16,
    deviceType: 'Regular smartphones',
    dimensions: '1080 x 1920px',
  },
  {
    aspectRatio: ASPECT_RATIOS.RATIO_9_19_5,
    deviceType: 'Galaxy S series',
    dimensions: '1080 x 2340px',
  },
  {
    aspectRatio: ASPECT_RATIOS.RATIO_9_20,
    deviceType: 'iPhone 12/13',
    dimensions: '1125 x 2436px',
  },
  {
    aspectRatio: ASPECT_RATIOS.RATIO_9_18,
    deviceType: 'Normal full screen',
    dimensions: '1080 x 2160px',
  },
  {
    aspectRatio: ASPECT_RATIOS.RATIO_9_21,
    deviceType: 'iPhone 14 Pro',
    dimensions: '1170 x 2532px',
  },
  {
    aspectRatio: ASPECT_RATIOS.RATIO_9_19,
    deviceType: 'Old Android',
    dimensions: '1080 x 2280px',
  },
];

/**
 * File upload constraints
 */
export const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as string[],
  STORAGE_FOLDER: 'splash-images',
};
