
import { initModals } from './components/modal.js';
import { initEditor } from './components/editor.js';
import { showToast, validateText, setElementError, clearElementError } from './utils/helpers.js';
document.addEventListener('DOMContentLoaded', () => {
initModals();
initEditor();

const burgerBtn = document.getElementById('burger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuCloseBtn = document.getElementById('menu-close-btn');

const toggleMenu = () => {
    const isActive = mobileMenu.classList.toggle('is-active');
    burgerBtn.setAttribute('aria-expanded', isActive);
    mobileMenu.setAttribute('aria-hidden', !isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
};

if (burgerBtn) burgerBtn.addEventListener('click', toggleMenu);
if (menuCloseBtn) menuCloseBtn.addEventListener('click', toggleMenu);

const dslInput = document.getElementById('dsl-input');
const canvasPlaceholder = document.getElementById('canvas-placeholder');
const runButtons = [document.getElementById('run-btn'), document.getElementById('mobile-run-btn')];

const executeDiagram = () => {
    if (!dslInput.value.trim()) {
        showToast('Editor is empty', 'error');
        return;
    }

    canvasPlaceholder.textContent = 'Processing...';
    canvasPlaceholder.style.opacity = '0.5';
    showToast('Compiling diagram DSL...');

    setTimeout(() => {
        canvasPlaceholder.innerHTML = `<div style="text-align:center; padding: 2rem;"><h3>Diagram Generated Successfully</h3><p style="font-size: 0.8rem; color: #64748b; margin-top: 0.5rem;">Rendered at ${new Date().toLocaleTimeString()}</p></div>`;
        canvasPlaceholder.style.opacity = '1';
        showToast('Render complete', 'success');
    }, 1200);
};

runButtons.forEach(btn => {
    if (btn) btn.addEventListener('click', executeDiagram);
});

const saveBtn = document.getElementById('save-btn');
const mobileSaveBtn = document.getElementById('mobile-save-btn');

const performSave = () => {
    showToast('Draft saved to storage');
};

if (saveBtn) saveBtn.addEventListener('click', performSave);
if (mobileSaveBtn) mobileSaveBtn.addEventListener('click', performSave);

const aiForm = document.getElementById('ai-form');
const promptInput = document.getElementById('ai-prompt-input');

if (aiForm) {
    aiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const promptValue = promptInput.value.trim();

        if (!validateText(promptValue, 10)) {
            setElementError(promptInput, 'Please provide more context (min 10 characters)');
            return;
        }

        clearElementError(promptInput);
        const submitBtn = document.getElementById('ai-generate-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Analyzing...';

        setTimeout(() => {
            const generatedDSL = `graph TD\n    A[${promptValue.substring(0, 10)}...] --> B(AI Neural Logic)\n    B --> C{Decision Path}\n    C -- Yes --> D[Result Output]\n    C -- No --> E[Retry Mode]`;
            dslInput.value = generatedDSL;
            
            const event = new Event('input', { bubbles: true });
            dslInput.dispatchEvent(event);
            
            showToast('AI Prompt processed');
            document.getElementById('ai-modal').classList.remove('is-active');
            document.body.style.overflow = '';
            
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 2500);
    });

    promptInput.addEventListener('input', () => {
        if (validateText(promptInput.value, 10)) {
            clearElementError(promptInput);
        }
    });
}

const confirmExportBtn = document.getElementById('confirm-export-btn');
if (confirmExportBtn) {
    confirmExportBtn.addEventListener('click', () => {
        const formatRadio = document.querySelector('input[name="fmt"]:checked');
        if (formatRadio) {
            const format = formatRadio.value;
            showToast(`Preparing download: diagram.${format}...`);
            
            setTimeout(() => {
                document.getElementById('export-modal').classList.remove('is-active');
                document.body.style.overflow = '';
                showToast('File downloaded successfully', 'success');
            }, 1500);
        }
    });
}

const notationItems = document.querySelectorAll('.header__menu-btn');
notationItems.forEach(btn => {
    btn.addEventListener('click', () => {
        const text = btn.textContent.trim();
        const isAction = btn.id?.includes('save') || btn.hasAttribute('aria-controls');
        
        if (!isAction) {
            notationItems.forEach(item => {
                if (!item.hasAttribute('aria-controls')) {
                    item.classList.remove('header__menu-btn--active');
                }
            });
            btn.classList.add('header__menu-btn--active');
            showToast(`Syntax set to: ${text}`);
        }
    });
});

const engineSelect = document.getElementById('engine-select');
if (engineSelect) {
    engineSelect.addEventListener('change', (e) => {
        showToast(`Rendering Engine changed to ${e.target.value.toUpperCase()}`);
    });
}

window.addEventListener('online', () => {
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    dot.className = 'status-bar__dot status-bar__dot--online';
    text.textContent = 'Engine: Connected';
    showToast('System online');
});

window.addEventListener('offline', () => {
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    dot.className = 'status-bar__dot';
    dot.style.backgroundColor = '#EF4444';
    text.textContent = 'Engine: Offline';
    showToast('Connection lost', 'error');
});

});