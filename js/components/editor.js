
import { saveToStorage, getFromStorage } from '../utils/helpers.js';
export function initEditor() {
const editor = document.getElementById('dsl-input');
const gutter = document.getElementById('line-numbers');
const STORAGE_KEY = 'diagramcode_draft';

if (!editor || !gutter) return;

const defaultCode = `graph TD\n    A[Start] --> B{Is it working?}\n    B -->|Yes| C[Great!]\n    B -->|No| D[Debug]\n    D --> B\n    C --> E[End]`;

const updateLineNumbers = () => {
    const linesCount = editor.value.split('\n').length;
    gutter.innerHTML = Array.from({ length: linesCount }, (_, i) => `<div>${i + 1}</div>`).join('');
};

const savedCode = getFromStorage(STORAGE_KEY);
editor.value = savedCode !== null ? savedCode : defaultCode;
updateLineNumbers();

editor.addEventListener('input', () => {
    updateLineNumbers();
    saveToStorage(STORAGE_KEY, editor.value);
});

editor.addEventListener('scroll', () => {
    gutter.scrollTop = editor.scrollTop;
});

editor.addEventListener('keydown', function(event) {
    if (event.key === 'Tab') {
        event.preventDefault();
        
        const start = this.selectionStart;
        const end = this.selectionEnd;
        
        this.value = this.value.substring(0, start) + "    " + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 4;
        
        updateLineNumbers();
        saveToStorage(STORAGE_KEY, this.value);
    }
});