"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorageLimit = void 0;
// Storage limits for user plans
const getStorageLimit = (plan) => {
    switch (plan) {
        case 'free':
            return 10 * 1024 * 1024 * 1024; // 10 GB
        case 'special':
            return 40 * 1024 * 1024 * 1024; // 40 GB
        case 'light':
            return 100 * 1024 * 1024 * 1024; // 100 GB
        case 'medium':
            return 1024 * 1024 * 1024 * 1024; // 1 TB
        case 'ultra':
            return 10 * 1024 * 1024 * 1024 * 1024; // 10 TB
        default:
            return 0;
    }
};
exports.getStorageLimit = getStorageLimit;
//# sourceMappingURL=getStorageLimit.js.map