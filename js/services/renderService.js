import { renderMermaid } from '../engines/mermaidEngine.js';
import { renderPlantUML } from '../engines/plantumlEngine.js';

export const renderDiagram = async (code, engine, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        let svgContent = '';
        
        if (engine === 'mermaid') {
            svgContent = await renderMermaid(code);
        } else if (engine === 'plantuml') {
            svgContent = await renderPlantUML(code);
        } else {
            throw new Error(`Engine "${engine}" is not supported.`);
        }
        
        container.innerHTML = svgContent;
    } catch (error) {
        container.innerHTML = `<div style="color: #ef4444; padding: 1.5rem; border: 1px solid #fca5a5; border-radius: 0.75rem; text-align: center; font-family: 'Source Code Pro', monospace; font-size: 13px; background-color: #fef2f2; line-height: 1.6;">
            <div style="font-weight: 700; margin-bottom: 0.5rem;">Render Error:</div>
            ${error.message}
        </div>`;
    }
};