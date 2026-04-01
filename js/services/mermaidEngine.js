/**
 * js/engines/mermaidEngine.js
 * Реальная интеграция с Mermaid.js (динамический импорт ESM-модуля)
 */

let mermaidInstance = null;

// Инициализация загружается асинхронно только при выборе Mermaid
const initMermaid = async () => {
    if (!mermaidInstance) {
        // Динамически импортируем актуальную версию Mermaid через CDN
        const mermaidModule = await import('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs');
        mermaidInstance = mermaidModule.default;
        
        mermaidInstance.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose', // Разрешаем кастомные стили
            fontFamily: 'Inter, sans-serif'
        });
    }
    return mermaidInstance;
};

export const renderMermaid = async (code) => {
    try {
        const mermaid = await initMermaid();
        // Генерируем уникальный ID для каждого рендера
        const id = `mermaid-svg-${Date.now()}`;
        
        // Рендерим SVG из кода
        const { svg } = await mermaid.render(id, code);
        return svg;
    } catch (error) {
        console.error("Mermaid Render Error:", error);
        throw new Error(`Ошибка синтаксиса Mermaid: ${error.message}`);
    }
};