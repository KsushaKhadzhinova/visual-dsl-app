import { CONFIG } from './config.js';

export const ApiService = {
    /**
     * Загрузка списка готовых шаблонов диаграмм
     */
    async fetchTemplates() {
        try {
            const response = await fetch(CONFIG.TEMPLATES_API);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch templates:", error);
            throw error;
        }
    }
};