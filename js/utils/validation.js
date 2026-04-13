export const Validator = {
    errors: [],

    validateDSL(text) {
        this.errors = [];
        const content = text.trim();

        if (content.length === 0) {
            this.errors.push('Editor is empty');
            return false;
        }

        if (content.length > 5000) {
            this.errors.push('Code exceeds character limit');
            return false;
        }

        const commonKeywords = ['graph', 'flowchart', 'sequence', 'class', 'state', 'erDiagram', 'pie', 'gantt'];
        const hasKeyword = commonKeywords.some(keyword => content.toLowerCase().includes(keyword));

        if (!hasKeyword) {
            this.errors.push('Missing diagram definition keyword');
        }

        const bracketPairs = {
            '[': ']',
            '(': ')',
            '{': '}'
        };
        
        const stack = [];
        for (let char of content) {
            if (bracketPairs[char]) {
                stack.push(char);
            } else if (Object.values(bracketPairs).includes(char)) {
                const last = stack.pop();
                if (bracketPairs[last] !== char) {
                    this.errors.push('Mismatched brackets detected');
                    break;
                }
            }
        }

        return this.errors.length === 0;
    },

    getErrors() {
        return this.errors;
    },

    sanitize(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};
