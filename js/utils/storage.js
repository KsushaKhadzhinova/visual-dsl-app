export const Storage = {
    keys: {
        CODE: 'visual_dsl_code',
        NOTATION: 'visual_dsl_notation',
        THEME: 'visual_dsl_theme'
    },

    save(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            return false;
        }
    },

    load(key) {
        return localStorage.getItem(key);
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    clear() {
        localStorage.clear();
    },

    has(key) {
        return localStorage.getItem(key) !== null;
    }
};
