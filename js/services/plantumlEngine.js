/**
 * js/engines/plantumlEngine.js
 * Интеграция с официальным сервером PlantUML.
 * ВНИМАНИЕ: Для работы этого модуля нужно добавить в <head> index.html строку:
 * <script src="https://cdn.jsdelivr.net/npm/plantuml-encoder@1.4.0/dist/plantuml-encoder.min.js"></script>
 */

export const renderPlantUML = async (code) => {
    try {
        // Проверяем, загружен ли энкодер (добавлен через CDN в HTML)
        if (typeof plantumlEncoder === 'undefined') {
            throw new Error("Библиотека plantumlEncoder не загружена. Проверьте index.html");
        }

        // Кодируем текст диаграммы в специальный формат для URL PlantUML
        const encodedCode = plantumlEncoder.encode(code);
        
        // Формируем URL для запроса векторной графики (SVG)
        const url = `https://www.plantuml.com/plantuml/svg/${encodedCode}`;
        
        // Делаем реальный запрос к серверу PlantUML для получения SVG-строки
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        
        const svgText = await response.text();
        return svgText;
    } catch (error) {
        console.error("PlantUML Render Error:", error);
        throw new Error(`Ошибка генерации PlantUML: ${error.message}`);
    }
};