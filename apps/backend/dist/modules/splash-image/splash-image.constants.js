"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLOAD_CONSTRAINTS = exports.DEFAULT_SPLASH_IMAGES = exports.ASPECT_RATIOS = void 0;
exports.ASPECT_RATIOS = {
    RATIO_9_16: '9:16',
    RATIO_9_19_5: '9:19.5',
    RATIO_9_20: '9:20',
    RATIO_9_18: '9:18',
    RATIO_9_21: '9:21',
    RATIO_9_19: '9:19',
};
exports.DEFAULT_SPLASH_IMAGES = [
    {
        aspectRatio: exports.ASPECT_RATIOS.RATIO_9_16,
        deviceType: 'Regular smartphones',
        dimensions: '1080 x 1920px',
    },
    {
        aspectRatio: exports.ASPECT_RATIOS.RATIO_9_19_5,
        deviceType: 'Galaxy S series',
        dimensions: '1080 x 2340px',
    },
    {
        aspectRatio: exports.ASPECT_RATIOS.RATIO_9_20,
        deviceType: 'iPhone 12/13',
        dimensions: '1125 x 2436px',
    },
    {
        aspectRatio: exports.ASPECT_RATIOS.RATIO_9_18,
        deviceType: 'Normal full screen',
        dimensions: '1080 x 2160px',
    },
    {
        aspectRatio: exports.ASPECT_RATIOS.RATIO_9_21,
        deviceType: 'iPhone 14 Pro',
        dimensions: '1170 x 2532px',
    },
    {
        aspectRatio: exports.ASPECT_RATIOS.RATIO_9_19,
        deviceType: 'Old Android',
        dimensions: '1080 x 2280px',
    },
];
exports.UPLOAD_CONSTRAINTS = {
    MAX_FILE_SIZE: 5 * 1024 * 1024,
    ALLOWED_MIME_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    STORAGE_FOLDER: 'splash-images',
};
//# sourceMappingURL=splash-image.constants.js.map