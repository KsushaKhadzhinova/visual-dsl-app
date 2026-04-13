export const DataParser = {
    parseDSL(text) {
        const lines = text.split('\n');
        const result = {
            type: 'Flowchart',
            nodeCount: 0,
            edgeCount: 0,
            nodes: [],
            edges: []
        };

        const nodeRegex = /([a-zA-Z0-9_-]+)([\[({][^\])}]+[\])}])/g;
        const edgeRegex = /-->|==>|--|-.->/g;

        lines.forEach(line => {
            const nodesInLine = line.match(nodeRegex);
            if (nodesInLine) {
                nodesInLine.forEach(match => {
                    result.nodes.push(match);
                    result.nodeCount++;
                });
            }

            const edgesInLine = line.match(edgeRegex);
            if (edgesInLine) {
                result.edgeCount += edgesInLine.length;
            }
        });

        return result;
    },

    isValid(text) {
        const content = text.trim();
        if (content.length < 5) return false;
        const keywords = ['graph', 'flowchart', 'stateDiagram', 'sequenceDiagram', 'classDiagram'];
        return keywords.some(keyword => content.includes(keyword));
    }
};