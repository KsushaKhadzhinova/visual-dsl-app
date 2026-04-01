/**
 * js/services/renderService.js
 * Продвинутый кастомный генератор SVG диаграмм для DiagramCode.
 * Включает движок Auto-Layout (BFS) для поддержки любых пользовательских схем,
 * сохраняя при этом строгий визуальный стиль из макетов.
 */

export const renderDiagram = (code, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 1. Разбираем текстовый код
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

    if (Object.keys(nodes).length === 0) {
        container.innerHTML = '<div style="color: #64748b; text-align: center; margin-top: 50px;">Схема пуста или содержит синтаксические ошибки.</div>';
        return;
    }

    // =========================================================================
    // 2. ДВИЖОК АВТО-РАССТАНОВКИ (AUTO-LAYOUT ALGORITHM)
    // =========================================================================
    
    const canvasWidth = 600;
    const canvasHeight = 500;
    const centerX = canvasWidth / 2;
    const positions = {};
    
    // Алгоритм BFS для вычисления глубины (уровня) каждого узла
    const nodeDepths = {};
    const visited = new Set();
    const rootId = Object.keys(nodes)[0]; // Берем первый объявленный узел как стартовый

    if (rootId) {
        const queue = [rootId];
        nodeDepths[rootId] = 0;
        visited.add(rootId);

        while (queue.length > 0) {
            const currentId = queue.shift();
            const currentDepth = nodeDepths[currentId];

            edges.forEach(edge => {
                if (edge.source === currentId && !visited.has(edge.target)) {
                    visited.add(edge.target);
                    nodeDepths[edge.target] = currentDepth + 1;
                    queue.push(edge.target);
                }
            });
        }
    }

    // Если остались изолированные узлы, спускаем их на нижний уровень
    let maxDepth = Math.max(0, ...Object.values(nodeDepths).filter(d => d !== undefined));
    Object.keys(nodes).forEach(id => {
        if (nodeDepths[id] === undefined) nodeDepths[id] = ++maxDepth;
    });

    // Группируем узлы по уровням (Y)
    const levels = {};
    Object.keys(nodes).forEach(id => {
        const d = nodeDepths[id];
        if (!levels[d]) levels[d] = [];
        levels[d].push(id);
    });

    // Распределяем координаты (X и Y)
    const Y_SPACING = 130; // Вертикальный отступ между блоками
    const X_SPACING = 280; // Горизонтальный отступ, если блоков несколько на одном уровне

    Object.keys(levels).forEach(depth => {
        const levelNodes = levels[depth];
        const y = 70 + parseInt(depth) * Y_SPACING; // Стартовый Y = 70

        const totalWidth = (levelNodes.length - 1) * X_SPACING;
        let startX = centerX - totalWidth / 2;

        levelNodes.forEach(id => {
            positions[id] = { x: startX, y: y };
            startX += X_SPACING;
        });
    });

    // =========================================================================
    // 3. ОТРИСОВКА В SVG (С ЦВЕТАМИ ИЗ МАКЕТА)
    // =========================================================================

    const colors = {
        startEnd: { fill: '#3b82f6', text: '#ffffff' }, // Синий
        decision: { fill: '#fbbf24', text: '#78350f' }, // Желтый
        error:    { fill: '#ef4444', text: '#ffffff' }, // Красный
        success:  { fill: '#10b981', text: '#ffffff' }, // Зеленый
        line: '#64748b' // Серый (стрелки)
    };

    let svgHTML = `<svg viewBox="0 0 ${canvasWidth} ${canvasHeight}" style="width: 100%; height: 100%; min-height: 400px; max-height: 80vh;" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="${colors.line}" />
            </marker>
        </defs>`;

    // Отрисовка связей (линий) под блоками
    edges.forEach(edge => {
        const src = positions[edge.source];
        const tgt = positions[edge.target];
        if (!src || !tgt) return;

        let pathD = '';
        
        // Авто-распознавание обратных связей (циклов)
        if (tgt.y <= src.y) {
            // Рисуем красивую кривую Безье (изгиб влево и вверх)
            pathD = `M ${src.x} ${src.y - 25} C ${src.x} ${src.y - 100}, ${tgt.x - 140} ${tgt.y}, ${tgt.x - 80} ${tgt.y}`;
        } else {
            // Прямые линии
            let startY = src.y + (nodes[edge.source].type === 'diamond' ? 0 : 25);
            let startX = src.x;
            
            // Если выходим из ромба и элементы разнесены по X (Yes / No)
            if (nodes[edge.source].type === 'diamond') {
                if (tgt.x > src.x) { startX += 80; startY = src.y; } // Вправо
                else if (tgt.x < src.x) { startX -= 80; startY = src.y; } // Влево
            }

            const endY = tgt.y - 25;
            pathD = `M ${startX} ${startY} L ${tgt.x} ${endY}`;
        }

        svgHTML += `<path d="${pathD}" stroke="${colors.line}" stroke-width="2" fill="none" marker-end="url(#arrowhead)" />`;

        // Текст на линиях (Yes / No)
        if (edge.label) {
            const midX = (src.x + tgt.x) / 2;
            const midY = (src.y + tgt.y) / 2;
            const offsetX = edge.label.toLowerCase() === 'yes' || edge.label.toLowerCase() === 'да' ? 15 : -15;
            
            svgHTML += `<text x="${midX + offsetX}" y="${midY - 10}" fill="${colors.line}" font-size="12" font-family="Inter, sans-serif" text-anchor="middle" font-weight="500">${edge.label}</text>`;
        }
    });

    // Отрисовка блоков поверх линий
    Object.values(nodes).forEach(node => {
        const pos = positions[node.id];
        if (!pos) return;

        // Динамическое определение темы по ключевым словам (как в умных редакторах)
        let theme = colors.startEnd; 
        const lowerLabel = node.label.toLowerCase();
        
        if (node.type === 'diamond') {
            theme = colors.decision;
        } else if (lowerLabel.includes('debug') || lowerLabel.includes('error') || lowerLabel.includes('ошибка') || lowerLabel.includes('no')) {
            theme = colors.error;
        } else if (lowerLabel.includes('great') || lowerLabel.includes('success') || lowerLabel.includes('успех') || lowerLabel.includes('end')) {
            theme = colors.success;
        }

        if (node.type === 'diamond') {
            // Желтый Ромб
            svgHTML += `<polygon points="${pos.x},${pos.y - 45} ${pos.x + 90},${pos.y} ${pos.x},${pos.y + 45} ${pos.x - 90},${pos.y}" fill="${theme.fill}" />`;
            svgHTML += `<text x="${pos.x}" y="${pos.y + 5}" text-anchor="middle" fill="${theme.text}" font-size="14" font-weight="500" font-family="Inter, sans-serif">${node.label}</text>`;
        } else {
            // Скругленные прямоугольники
            svgHTML += `<rect x="${pos.x - 70}" y="${pos.y - 25}" width="140" height="50" rx="8" fill="${theme.fill}" />`;
            svgHTML += `<text x="${pos.x}" y="${pos.y + 5}" text-anchor="middle" fill="${theme.text}" font-size="15" font-family="Inter, sans-serif">${node.label}</text>`;
        }
    });

    svgHTML += `</svg>`;
    container.innerHTML = svgHTML;
};

// Функция парсинга ID и типа скобок
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