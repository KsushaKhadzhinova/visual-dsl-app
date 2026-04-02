export const CONFIG = {
    // Используем Mock API или реальный сервис (например, JSONPlaceholder для шаблонов)
    TEMPLATES_API: "https://jsonplaceholder.typicode.com/posts?_limit=5",
    AI_ENDPOINT: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    API_KEY: "", // Сюда вставляется ключ (оставим пустым по требованиям безопасности)
    STORAGE_KEYS: {
        DRAFT: "diagram_code_draft",
        TEMPLATES_CACHE: "templates_cache",
        LAST_SYNC: "last_sync_time"
    }
};