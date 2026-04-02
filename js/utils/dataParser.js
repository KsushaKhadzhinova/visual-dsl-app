export const DataParser = {
    /**
     * Превращаем текстовые посты из API в заготовки Mermaid-кода
     */
    parseToDiagram(rawData) {
        return rawData.map(item => ({
            id: item.id,
            title: item.title.slice(0, 20), // Берем часть заголовка
            code: `graph TD\n  Start --> Node_${item.id}[${item.title.split(' ')[0]}] --> End`
        }));
    }
};