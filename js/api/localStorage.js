export const StorageService = {
    set(key, data) {
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(key, serializedData);
        } catch (e) {
            console.error("Save error:", e);
        }
    },

    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("Load error:", e);
            return null;
        }
    },

    remove(key) {
        localStorage.removeItem(key);
    }
};