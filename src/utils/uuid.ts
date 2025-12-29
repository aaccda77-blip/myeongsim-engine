// Utility to generate UUIDs even in non-secure contexts (HTTP)
export function generateUUID(): string {
    // Use crypto.randomUUID if available (HTTPS or Localhost)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        try {
            return crypto.randomUUID();
        } catch (e) {
            // Fallback if it fails
        }
    }

    // Fallback for HTTP / Older Browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
