export const getStorageLimit = (plan: any): number => {
  switch (plan) {
    case "free":
      return 10 * 1024 * 1024 * 1024; // 10 GB
    case "special":
      return 40 * 1024 * 1024 * 1024; // 40 GB
    case "light":
      return 100 * 1024 * 1024 * 1024; // 100 GB
    case "medium":
      return 1024 * 1024 * 1024 * 1024; // 1 TB
    case "ultra":
      return 10 * 1024 * 1024 * 1024 * 1024; // 10 TB
    default:
      return 0;
  }
};
