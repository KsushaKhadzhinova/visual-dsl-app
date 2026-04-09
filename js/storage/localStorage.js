export const StorageService = {
    save(key, value) {
        try {
            const serializedData = JSON.stringify(value);
            localStorage.setItem(key, serializedData);
            return true;
        } catch (error) {
            console.error('Local Storage Save Error:', error);
            return false;
        }
    },

    load(key) {
        try {
            const item = localStorage.getItem(key);
            if (item === null) return null;
            return JSON.parse(item);
        } catch (error) {
            console.error('Local Storage Load Error:', error);
            return null;
        }
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    has(key) {
        return localStorage.getItem(key) !== null;
    },

    clearByPrefix(prefix) {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(prefix)) {
                localStorage.removeItem(key);
            }
        });
    },

    saveWithMeta(key, data) {
        const packageData = {
            data: data,
            updatedAt: Date.now(),
            version: '1.1.0'
        };
        this.save(key, packageData);
    },

    isExpired(key, expiryTimeMs) {
        const item = this.load(key);
        if (!item || !item.updatedAt) return true;
        return (Date.now() - item.updatedAt) > expiryTimeMs;
    },

    getByteSize() {
        let total = 0;
        for (let x in localStorage) {
            if (localStorage.hasOwnProperty(x)) {
                total += (localStorage[x].length + x.length) * 2;
            }
        }
        return (total / 1024).toFixed(2);
    }
};