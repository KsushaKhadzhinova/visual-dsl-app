let mermaidInstance = null;

const initMermaid = async () => {
    if (!mermaidInstance) {
        const mermaidModule = await import('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs');
        mermaidInstance = mermaidModule.default;
        
        mermaidInstance.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            fontFamily: 'Inter, sans-serif'
        });
    }
    return mermaidInstance;
};

export const renderMermaid = async (code) => {
    try {
        const mermaid = await initMermaid();
        const id = `mermaid-svg-${Date.now()}`;
        const { svg } = await mermaid.render(id, code);
        return svg;
    } catch (error) {
        throw new Error(error.message);
    }
};