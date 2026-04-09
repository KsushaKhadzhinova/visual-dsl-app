import { ApiService } from './api/apiService.js';
import { CONFIG } from './api/config.js';
import { StorageService } from './storage/localStorage.js';
import { DataParser } from './utils/dataParser.js';
import { showToast, validateText } from './utils/helpers.js';
import { initModals } from './components/modal.js';

document.addEventListener('DOMContentLoaded', () => {
    initModals();

    const dslInput = document.getElementById('dsl-input');
    const netDot = document.getElementById('status-dot-indicator');
    const netText = document.getElementById('status-text-msg');
    const templateContainer = document.getElementById('api-templates-list');
    const refreshBtn = document.getElementById('api-refresh-btn');
    const runBtn = document.getElementById('run-btn');
    const mobileRunBtn = document.getElementById('mobile-run-btn');
    const renderArea = document.getElementById('render-area');

    const updateOnlineStatus = () => {
        const isOnline = navigator.onLine;
        netDot.style.backgroundColor = isOnline ? '#10B981' : '#EF4444';
        netText.textContent = isOnline ? 'Engine: Connected' : 'Engine: Offline Mode';
        
        if (!isOnline) {
            showToast('Network connection lost. Offline mode active.', 'error');
        } else {
            showToast('System is online.');
        }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    const loadRemoteTemplates = async (forceSync = false) => {
        const cacheKey = CONFIG.STORAGE.TEMPLATES_CACHE;
        const oneHour = 3600000;

        if (!forceSync && !StorageService.isExpired(cacheKey, oneHour)) {
            const cached = StorageService.load(cacheKey);
            if (cached) {
                renderSidebarTemplates(cached.data);
                return;
            }
        }

        if (!navigator.onLine) {
            const cached = StorageService.load(cacheKey);
            if (cached) renderSidebarTemplates(cached.data);
            return;
        }

        templateContainer.innerHTML = '<div class="loader-skeleton"></div><div class="loader-skeleton"></div>';
        
        try {
            const rawData = await ApiService.fetchTemplates();
            const processedData = DataParser.parseTemplatesFromApi(rawData);
            
            StorageService.saveWithMeta(cacheKey, processedData);
            renderSidebarTemplates(processedData);
        } catch (error) {
            showToast('Failed to sync templates', 'error');
            templateContainer.innerHTML = '<div style="padding:1rem; font-size:11px; color:#ef4444;">Sync Error</div>';
        }
    };

    const renderSidebarTemplates = (templates) => {
        templateContainer.innerHTML = templates.map(t => `
            <div class="template-card-ui" data-code="${t.dslCode}">
                <div class="template-card-ui__header">
                    <span class="template-card-ui__tag">${t.category}</span>
                </div>
                <h4 class="template-card-ui__title">${t.displayTitle}</h4>
                <p class="template-card-ui__desc">Example ${t.id} pattern</p>
            </div>
        `).join('');

        templateContainer.querySelectorAll('.template-card-ui').forEach(card => {
            card.addEventListener('click', () => {
                const code = card.getAttribute('data-code');
                dslInput.value = code;
                dslInput.dispatchEvent(new Event('input'));
                showToast('Template applied');
                triggerRender();
            });
        });
    };

    const triggerRender = async () => {
        const code = dslInput.value.trim();
        if (!code) return;

        renderArea.style.opacity = '0.4';
        
        try {
            const engine = document.getElementById('engine-select').value;
            
            if (typeof mermaid !== 'undefined' && engine === 'mermaid') {
                const { svg } = await mermaid.render('mermaid-svg-' + Date.now(), code);
                renderArea.innerHTML = svg;
            } else {
                renderArea.innerHTML = `<div class="placeholder-fallback">Render preview logic for ${engine}</div>`;
            }
            
            showToast('Diagram compiled', 'success');
        } catch (e) {
            console.error(e);
            showToast('DSL Syntax Error', 'error');
        } finally {
            renderArea.style.opacity = '1';
        }
    };

    if (refreshBtn) refreshBtn.addEventListener('click', () => loadRemoteTemplates(true));
    if (runBtn) runBtn.addEventListener('click', triggerRender);
    if (mobileRunBtn) mobileRunBtn.addEventListener('click', triggerRender);

    const savedDraft = StorageService.load(CONFIG.STORAGE.CODE_DRAFT);
    dslInput.value = savedDraft || CONFIG.DEFAULTS.DSL_CODE;

    dslInput.addEventListener('input', (e) => {
        const metrics = DataParser.getDslMetrics(e.target.value);
        StorageService.save(CONFIG.STORAGE.CODE_DRAFT, e.target.value);
    });

    const aiForm = document.getElementById('ai-request-form');
    if (aiForm) {
        aiForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const promptArea = document.getElementById('ai-prompt-area');
            const prompt = promptArea.value.trim();

            if (!validateText(prompt, CONFIG.VALIDATION.MIN_PROMPT_LENGTH)) {
                showToast('Description too short', 'error');
                return;
            }

            const actionBtn = document.getElementById('ai-action-btn');
            const originalHTML = actionBtn.innerHTML;
            
            actionBtn.disabled = true;
            actionBtn.innerHTML = 'AI Thinking...';

            try {
                const engine = document.getElementById('ai-engine-select').value;
                const result = await ApiService.simulateAIGenerate(prompt, engine);
                
                dslInput.value = result.suggestedCode;
                dslInput.dispatchEvent(new Event('input'));
                
                showToast('AI Generation successful');
                document.getElementById('ai-modal').classList.remove('is-active');
                document.body.style.overflow = '';
                
                triggerRender();
            } catch (err) {
                showToast(err.message, 'error');
            } finally {
                actionBtn.disabled = false;
                actionBtn.innerHTML = originalHTML;
            }
        });
    }

    const exportActionBtn = document.getElementById('confirm-export-action');
    if (exportActionBtn) {
        exportActionBtn.addEventListener('click', async () => {
            const format = document.querySelector('input[name="export-fmt"]:checked').value;
            const meta = DataParser.prepareExportMeta('diagram', format);
            
            showToast(`Generating ${format.toUpperCase()} file...`);
            
            await new Promise(r => setTimeout(r, 1000));
            
            showToast('Export successful: ' + meta.fullName, 'success');
            document.getElementById('export-modal').classList.remove('is-active');
            document.body.style.overflow = '';
        });
    }

    loadRemoteTemplates();

    setTimeout(() => {
        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
            triggerRender();
        }
    }, 500);
});