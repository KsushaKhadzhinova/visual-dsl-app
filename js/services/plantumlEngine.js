let encoder = null;

const initEncoder = async () => {
    if (!encoder) {
        const module = await import('https://cdn.jsdelivr.net/npm/plantuml-encoder@1.4.0/+esm');
        encoder = module.default || module;
    }
    return encoder;
};

export const renderPlantUML = async (code) => {
    try {
        const plantumlEncoder = await initEncoder();
        const encodedCode = plantumlEncoder.encode(code);
        const url = `https://www.plantuml.com/plantuml/svg/${encodedCode}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        
        return await response.text();
    } catch (error) {
        throw new Error(error.message);
    }
};