export const DiagramAPI = {
    baseUrl: 'https://kroki.io',

    async fetchDiagram(dslText, notation = 'mermaid') {
        const type = notation.toLowerCase().trim();
        const encoded = this._encodeData(dslText);

        try {
            const response = await fetch(`${this.baseUrl}/${type}/svg/${encoded}`);
            
            if (!response.ok) {
                throw new Error('api_failure');
            }

            return await response.text();
        } catch (error) {
            throw error;
        }
    },

    _encodeData(data) {
        return btoa(encodeURIComponent(data).replace(/%([0-9A-F]{2})/g,
            function(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
    }
};
