/**
 * js/services/renderService.js
 * Умный алгоритм автоматической расстановки SVG элементов.
 * Рисует диаграмму строго по стилям и пропорциям макетов (Figma).
 */

export const renderDiagram = (code, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Парсим текст редактора
    const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('graph'));
    const nodes = {};
    const edges = [];

    lines.forEach(line => {
        const parts = line.split(/-->|->/);
        if (parts.length > 1) {
            const sourcePart = parts[0].trim();
            let targetPart = parts[1].trim();
            let label = "";

            if (targetPart.startsWith('|')) {
                const labelEnd = targetPart.indexOf('|', 1);
                label = targetPart.substring(1, labelEnd);
                targetPart = targetPart.substring(labelEnd + 1).trim();
            }

            const sourceId = extractNode(sourcePart, nodes);
            const targetId = extractNode(targetPart, nodes);
            edges.push({ source: sourceId, target: targetId, label });
        } else {
            extractNode(line, nodes);
        }
    });

    if (Object.keys(nodes).length === 0) return;

    // =========================================================================
    // АЛГОРИТМ РАСЧЕТА КООРДИНАТ
    // =========================================================================
    const canvasWidth = 600;
    const canvasHeight = 500;
    const centerX = canvasWidth / 2;
    const positions = {};
    
    // Сетка: depth (Уровень по Y), xGrid (-1: лево, 0: центр, 1: право)
    const nodeDepths = {};
    const nodeXGrid = {}; 
    const visited = new Set();
    const rootId = Object.keys(nodes)[0];

    // Вычисляем логические уровни и колонки
    if (rootId) {
        const queue = [rootId];
        nodeDepths[rootId] = 0;
        nodeXGrid[rootId] = 0; // Корень в центре
        visited.add(rootId);

        while (queue.length > 0) {
            const currentId = queue.shift();
            const currentDepth = nodeDepths[currentId];
            const currentX = nodeXGrid[currentId];

            const childEdges = edges.filter(e => e.source === currentId && !visited.has(e.target));

            childEdges.forEach((edge, index) => {
                visited.add(edge.target);
                nodeDepths[edge.target] = currentDepth + 1;
                
                let childX = currentX;
                if (edge.label) {
                    const lbl = edge.label.toLowerCase();
                    if (lbl.includes('yes') || lbl.includes('да')) childX = currentX + 1; // Yes уходит вправо
                    else if (lbl.includes('no') || lbl.includes('нет')) childX = currentX - 1; // No уходит влево
                } else if (childEdges.length > 1) {
                    childX = currentX + (index === 0 ? -1 : 1); // Просто разводим по сторонам
                }
                
                nodeXGrid[edge.target] = childX;
                queue.push(edge.target);
            });
        }
    }

    // Переводим логическую сетку в пиксели
    Object.keys(nodes).forEach(id => {
        const d = nodeDepths[id] || 0;
        const xGrid = nodeXGrid[id] || 0;
        positions[id] = {
            x: centerX + (xGrid * 150), // Отступ в ширину 150px
            y: 60 + (d * 110)           // Отступ в высоту 110px
        };
    });

    // =========================================================================
    // ОТРИСОВКА (ЦВЕТА СТРОГО ПО МАКЕТАМ)
    // =========================================================================
    const colors = {
        startEnd: { fill: '#3b82f6', text: '#ffffff' }, // Синий
        decision: { fill: '#fbbf24', text: '#78350f' }, // Желтый
        error:    { fill: '#ef4444', text: '#ffffff' }, // Красный
        success:  { fill: '#10b981', text: '#ffffff' }, // Зеленый
        line: '#64748b' // Серый (стрелки)
    };

    let svgHTML = `<svg viewBox="0 0 ${canvasWidth} ${canvasHeight}" style="width: 100%; height: 100%; max-height: 80vh;" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="${colors.line}" />
            </marker>
        </defs>`;

    // Линии и стрелки
    edges.forEach(edge => {
        const src = positions[edge.source];
        const tgt = positions[edge.target];
        if (!src || !tgt) return;

        let pathD = '';
        let startX = src.x;
        let startY = src.y;
        let endX = tgt.x;
        let endY = tgt.y;

        const srcType = nodes[edge.source].type;
        const tgtType = nodes[edge.target].type;

        // Если это Цикл (линия идет снизу вверх)
        if (tgt.y <= src.y) {
            const isLeft = src.x <= centerX;
            startY = src.y - (srcType === 'diamond' ? 40 : 25);
            endX = tgt.x + (isLeft ? -80 : 80); // Входим сбоку
            
            const curveOffset = isLeft ? -90 : 90;
            // Красивая кривая Безье для цикла
            pathD = `M ${startX} ${startY} C ${startX} ${startY - 60}, ${endX + curveOffset} ${endY}, ${endX} ${endY}`;
        } else {
            // Обычная линия
            if (srcType === 'diamond') {
                if (tgt.x > src.x) { startX += 80; } // Выходим справа
                else if (tgt.x < src.x) { startX -= 80; } // Выходим слева
                else { startY += 40; } // Выходим снизу
            } else {
                startY += 25; // Выходим снизу
            }

            endY -= (tgtType === 'diamond' ? 40 : 25); // Входим сверху
            pathD = `M ${startX} ${startY} L ${endX} ${endY}`;
        }

        svgHTML += `<path d="${pathD}" stroke="${colors.line}" stroke-width="2" fill="none" marker-end="url(#arrowhead)" />`;

        // Текст на стрелке (Yes/No)
        if (edge.label) {
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;
            const isRight = tgt.x > src.x;
            const offsetX = isRight ? 12 : -12;
            const align = isRight ? 'start' : 'end';
            
            svgHTML += `<text x="${midX + offsetX}" y="${midY - 5}" fill="${colors.line}" font-size="12" font-family="Inter, sans-serif" text-anchor="${align}" font-weight="500">${edge.label}</text>`;
        }
    });

    // Блоки
    Object.values(nodes).forEach(node => {
        const pos = positions[node.id];
        if (!pos) return;

        let theme = colors.startEnd; 
        const lowerLabel = node.label.toLowerCase();
        
        if (node.type === 'diamond') {
            theme = colors.decision;
        } else if (lowerLabel.includes('debug') || lowerLabel.includes('error') || lowerLabel.includes('no')) {
            theme = colors.error;
        } else if (lowerLabel.includes('great') || lowerLabel.includes('success')) {
            theme = colors.success;
        }

        if (node.type === 'diamond') {
            svgHTML += `<polygon points="${pos.x},${pos.y - 40} ${pos.x + 80},${pos.y} ${pos.x},${pos.y + 40} ${pos.x - 80},${pos.y}" fill="${theme.fill}" />`;
            svgHTML += `<text x="${pos.x}" y="${pos.y + 5}" text-anchor="middle" fill="${theme.text}" font-size="13" font-weight="500" font-family="Inter, sans-serif">${node.label}</text>`;
        } else {
            svgHTML += `<rect x="${pos.x - 65}" y="${pos.y - 25}" width="130" height="50" rx="8" fill="${theme.fill}" />`;
            svgHTML += `<text x="${pos.x}" y="${pos.y + 5}" text-anchor="middle" fill="${theme.text}" font-size="14" font-weight="500" font-family="Inter, sans-serif">${node.label}</text>`;
        }
    });

    svgHTML += `</svg>`;
    container.innerHTML = svgHTML;
};

// Парсинг ID и типа скобок
function extractNode(str, nodesObj) {
    const match = str.match(/^([A-Za-z0-9_А-Яа-я]+)(?:(\[|\{|\()(.+?)(\]|\}|\)))?/);
    if (!match) return str;

    const id = match[1];
    const type = match[2] === '{' ? 'diamond' : 'rect';
    const label = match[3] || id;

    if (!nodesObj[id]) {
        nodesObj[id] = { id, label, type };
    } else if (match[3]) {
        nodesObj[id].label = label;
        nodesObj[id].type = type;
    }
    return id;
}