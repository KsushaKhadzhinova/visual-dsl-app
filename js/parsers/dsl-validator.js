export const DslValidator = {
    validate(code) {
        const c = code.toLowerCase();
        return c.includes('graph') || c.includes('flowchart') || c.includes('sequence') || c.includes('class');
    }
};
