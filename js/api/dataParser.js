export const DataParser = {
    mapApiToTemplates(rawData) {
        return rawData.map(item => ({
            id: item.id,
            title: item.title.split(' ').slice(0, 2).join(' '),
            code: `graph TD\n  Start --> Node_${item.id}[${item.title.substring(0, 10)}...] --> End`
        }));
    }
};