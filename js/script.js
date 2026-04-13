import { DiagramAPI } from './api/ai/ai-service.js';
import { LocalStorageManager } from './storage/local-storage-manager.js';
import { DslValidator } from './parsers/dsl-validator.js';
import { ToastProvider } from './components/ui/toast/toast-provider.js';
import { ModalManager } from './components/ui/modal/modal-manager.js';

document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('dsl-input');
    const lineNumbers = document.getElementById('line-numbers');
    const runBtn = document.getElementById('runBtn');
    const saveBtn = document.getElementById('saveBtn');
    const canvas = document.getElementById('canvas');
    const terminal = document.getElementById('terminal-output');
    const cursorStat = document.getElementById('cursor-pos');
    const statNodes = document.getElementById('stat-nodes');
    const statEdges = document.getElementById('stat-edges');

    const STORAGE_KEY = 'visual_dsl_code';

    const log = (msg, type = 'info') => {
        const p = document.createElement('p');
        p.className = `log--${type}`;
        p.textContent = `> [${new Date().toLocaleTimeString()}] ${msg}`;
        terminal.appendChild(p);
        terminal.scrollTop = terminal.scrollHeight;
    };

    const updateLineNumbers = () => {
        const lines = editor.value.split('\n').length;
        lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
    };

    const updateStats = (code) => {
        const nodes = (code.match(/\[|{/g) || []).length;
        const edges = (code.match(/-->|==>|->/g) || []).length;
        statNodes.textContent = nodes;
        statEdges.textContent = edges;
    };

    const render = async () => {
        const code = editor.value;
        if (!DslValidator.validate(code)) {
            log('Validation failed: Missing keywords or syntax error', 'error');
            ToastProvider.show('Invalid DSL Syntax', 'error');
            return;
        }

        log('Generating diagram...');
        canvas.style.opacity = '0.5';

        try {
            const svg = await DiagramAPI.fetchDiagram(code);
            canvas.innerHTML = svg;
            log('Diagram rendered successfully', 'success');
            ToastProvider.show('Render Complete', 'success');
            updateStats(code);
        } catch (err) {
            log('API Error: Failed to fetch diagram', 'error');
            ToastProvider.show('Render Failed', 'error');
        } finally {
            canvas.style.opacity = '1';
        }
    };

    const saveCode = () => {
        LocalStorageManager.save(STORAGE_KEY, editor.value);
        log('Code saved to LocalStorage', 'success');
        ToastProvider.show('Saved Successfully', 'success');
    };

    editor.addEventListener('input', () => {
        updateLineNumbers();
        updateStats(editor.value);
    });

    editor.addEventListener('scroll', () => {
        lineNumbers.scrollTop = editor.scrollTop;
    });

    editor.addEventListener('keyup', () => {
        const pos = editor.selectionStart;
        const textBefore = editor.value.substring(0, pos);
        const lines = textBefore.split('\n');
        cursorStat.textContent = `Ln ${lines.length}, Col ${lines[lines.length - 1].length + 1}`;
    });

    runBtn.addEventListener('click', render);
    saveBtn.addEventListener('click', saveCode);

    document.getElementById('btn-pricing').addEventListener('click', () => {
        ModalManager.open('modal-pricing');
    });

    document.getElementById('supportBtn').addEventListener('click', () => {
        ModalManager.open('modal-support');
    });

    document.getElementById('support-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('support-email').value;
        if (!email.includes('@')) {
            ToastProvider.show('Invalid Email', 'error');
            return;
        }
        log(`Feedback sent from ${email}`, 'success');
        ToastProvider.show('Feedback Sent!', 'success');
        ModalManager.closeAll();
    });

    const saved = LocalStorageManager.load(STORAGE_KEY);
    if (saved) {
        editor.value = saved;
        updateLineNumbers();
        updateStats(saved);
        render();
    }

    log('VisualDSL Studio Initialized');
});
