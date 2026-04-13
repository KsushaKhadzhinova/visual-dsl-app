export const LocalStorageManager = {
    save(key, val) {
        localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
    },
    load(key) {
        const val = localStorage.getItem(key);
        try {
            return JSON.parse(val);
        } catch {
            return val;
        }
    }
};
