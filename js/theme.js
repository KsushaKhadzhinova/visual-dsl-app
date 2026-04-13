import { Storage } from './utils/storage.js';

export const ThemeManager = {
    themes: {
        DARK: 'dark-theme',
        LIGHT: 'light-theme'
    },

    init() {
        const savedTheme = Storage.load(Storage.keys.THEME) || this.themes.DARK;
        this.apply(savedTheme);
        
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    },

    toggle() {
        const current = document.body.classList.contains(this.themes.LIGHT) 
            ? this.themes.LIGHT 
            : this.themes.DARK;
            
        const next = current === this.themes.DARK ? this.themes.LIGHT : this.themes.DARK;
        this.apply(next);
    },

    apply(themeName) {
        document.body.classList.remove(this.themes.DARK, this.themes.LIGHT);
        document.body.classList.add(themeName);
        Storage.save(Storage.keys.THEME, themeName);
    }
};

ThemeManager.init();