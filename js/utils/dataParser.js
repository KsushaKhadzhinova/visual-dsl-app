export const DataParser = {
    parseTemplatesFromApi(rawData) {
        if (!Array.isArray(rawData)) return [];
        
        return rawData.map(item => ({
            id: item.id,
            displayTitle: this.formatShortTitle(item.title),
            fullTitle: item.title,
            category: item.id % 2 === 0 ? 'Workflow' : 'System',
            dslCode: `graph TD\n    A[${item.title.substring(0, 10)}...] --> B{Decision}\n    B -- OK --> C[Final Node]\n    B -- FAIL --> D[Error Handler]`
        }));
    },

    formatShortTitle(str) {
        if (!str) return 'Untitled';
        const words = str.split(' ');
        return words.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    },

    stripMarkdown(content) {
        let code = content.trim();
        const markdownRegex = /```(?:[a-z]+)?\n([\s\S]*?)```/i;
        const match = code.match(markdownRegex);
        
        if (match && match[1]) {
            return match[1].trim();
        }
        
        return code.replace(/```/g, '').trim();
    },

    getDslMetrics(code) {
        if (!code) return { nodes: 0, links: 0, complexity: 'Empty' };

        const nodeMatches = code.match(/[\[\(\{\>].+?[\]\)\}\<]/g) || [];
        const linkMatches = code.match(/-->|->|==>|~~>/g) || [];
        
        let level = 'Simple';
        if (nodeMatches.length > 5 || linkMatches.length > 5) level = 'Moderate';
        if (nodeMatches.length > 10 || linkMatches.length > 10) level = 'Complex';

        return {
            nodes: nodeMatches.length,
            links: linkMatches.length,
            complexity: level,
            isReady: code.trim().length > 10
        };
    },

    prepareExportMeta(filename, format) {
        const cleanName = filename
            .replace(/[^\w\s-]/g, '')
            .trim()
            .replace(/[-\s]+/g, '-')
            .toLowerCase() || 'diagram';
            
        return {
            fullName: `${cleanName}-${Date.now()}.${format}`,
            timestamp: new Date().toISOString(),
            mimeType: format === 'svg' ? 'image/svg+xml' : 'image/png'
        };
    },

    jsonToSimpleFlow(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            let dsl = 'graph LR\n';
            
            Object.entries(data).forEach(([key, value], index) => {
                const safeValue = String(value).substring(0, 20).replace(/[\[\]]/g, '');
                dsl += `    Step${index}[${key}: ${safeValue}] --> AppSync\n`;
            });
            
            return dsl;
        } catch (e) {
            return null;
        }
    }
};