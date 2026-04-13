export const DiagramAPI = {
    baseUrl: 'https://kroki.io',
    async fetchDiagram(dslText, notation = 'mermaid') {
        const type = notation.toLowerCase().trim();
        const encoded = btoa(encodeURIComponent(dslText).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
        const response = await fetch(`${this.baseUrl}/${type}/svg/${encoded}`);
        if (!response.ok) throw new Error('api_failure');
        return await response.text();
    }
};
