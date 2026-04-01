/**
 * js/services/aiService.js
 * Реальная HTTP-интеграция с нейросетями (Используя Fetch API)
 */

// В реальном проекте этот ключ не должен храниться на фронтенде,
// но для лабораторной работы можно использовать тестовый или прокси-сервер.
const AI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
// const API_KEY = "sk-ваша-апи-ключ"; // Раскомментируйте и вставьте ключ для реального запроса

export const generateDiagramFromPrompt = async (promptText, notation = 'mermaid') => {
    
    // Системный промпт для точной настройки нейросети
    const systemPrompt = `You are a DiagramCode assistant. Generate ONLY valid ${notation} code for the user's request. 
    Do not include markdown blocks like \`\`\`mermaid. Output ONLY the raw code string.`;

    try {
        // ЕСЛИ АПИ КЛЮЧ НЕ ЗАДАН - ИСПОЛЬЗУЕМ "УМНУЮ ЗАГЛУШКУ" (Чтобы проект не падал на защите)
        if (typeof API_KEY === 'undefined' || !API_KEY) {
            console.warn("API Key not found. Using local smart mock generation.");
            return mockAIGeneration(promptText, notation);
        }

        // РЕАЛЬНЫЙ ЗАПРОС К OPENAI
        const response = await fetch(AI_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: promptText }
                ],
                temperature: 0.3
            })
        });

        if (!response.ok) {
            throw new Error(`AI API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
        
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw error;
    }
};

// Заглушка для лабораторной, если нет реального API-ключа (генерирует код в зависимости от ключевых слов)
const mockAIGeneration = async (prompt, notation) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const lowerPrompt = prompt.toLowerCase();
            let code = "";
            
            if (notation === 'mermaid') {
                if (lowerPrompt.includes('заказ') || lowerPrompt.includes('пицц')) {
                    code = `graph TD\n  A[Клиент делает заказ] --> B{Есть ингредиенты?}\n  B -->|Да| C[Готовим пиццу]\n  C --> D[Доставка]\n  B -->|Нет| E[Отказ]`;
                } else if (lowerPrompt.includes('авторизац') || lowerPrompt.includes('логин')) {
                    code = `sequenceDiagram\n  User->>Server: POST /login\n  Server-->>DB: Check credentials\n  DB-->>Server: valid\n  Server->>User: 200 OK + JWT Token`;
                } else {
                    code = `graph LR\n  A[Начало] --> B[Обработка: ${prompt.substring(0, 20)}...]\n  B --> C[Конец]`;
                }
            } else {
                code = `@startuml\nstart\n:${prompt.substring(0, 20)}...;\nstop\n@enduml`;
            }
            resolve(code);
        }, 2000); // Имитация времени "думания" ИИ
    });
};