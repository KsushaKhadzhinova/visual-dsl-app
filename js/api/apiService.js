import { CONFIG } from './config.js';

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const ApiService = {
    async fetchTemplates() {
        let attempts = 0;
        const maxAttempts = CONFIG.VALIDATION.MAX_RETRY_ATTEMPTS;

        while (attempts < maxAttempts) {
            try {
                const response = await fetch(CONFIG.API.TEMPLATES_URL);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                return await response.json();
            } catch (error) {
                attempts++;
                if (attempts >= maxAttempts) {
                    console.error('All fetch retry attempts failed:', error.message);
                    throw error;
                }
                await wait(CONFIG.VALIDATION.RETRY_DELAY);
            }
        }
    },

    async simulateAIGenerate(promptText, engine = 'mermaid') {
        const payload = {
            id: Date.now(),
            prompt: promptText,
            targetEngine: engine,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch(CONFIG.API.MOCK_POST_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`AI Simulation failure: ${response.status}`);
            }

            const data = await response.json();

            return {
                originalId: data.id,
                suggestedCode: `graph TD\n    Node_${data.id}[${promptText.substring(0, 10)}...] --> B(Neural Process)\n    B --> C{Success}\n    C -- Yes --> D[Final Logic]\n    C -- No --> E[Retry Mode]`
            };
        } catch (error) {
            throw new Error(`Network failure during generation: ${error.message}`);
        }
    },

    async checkEndpointHealth() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const response = await fetch(CONFIG.API.TEMPLATES_URL, { 
                method: 'HEAD', 
                signal: controller.signal 
            });

            clearTimeout(timeoutId);
            return response.ok;
        } catch (error) {
            return false;
        }
    }
};