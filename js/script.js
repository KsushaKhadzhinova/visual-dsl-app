import { ApiService } from './api/apiService.js';
import { StorageService } from './storage/localStorage.js';
import { DataParser } from './utils/dataParser.js';
import { CONFIG } from './api/config.js';
import { showToast } from './utils/helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
    const statusDot = document.getElementById('net-dot');
    const statusText = document.getElementById('net-status');
    const dslInput = document.getElementById('dsl-input');
    const canvas = document.getElementById('diagram-canvas');

    // --- ЧАСТЬ 1: Сетевой статус (Online/Offline) ---
    const updateOnlineStatus = () => {
        const isOnline = navigator.onLine;
        statusDot.className = `status-dot ${isOnline ? 'status-dot--active' : 'status-dot--offline'}`;
        statusText.textContent = isOnline ? 'Engine: Connected' : 'Engine: Offline (Cache Mode)';
        if (!isOnline) showToast('Вы перешли в автономный режим', 'warning');
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    // --- ЧАСТЬ 2: Загрузка шаблонов (Async API + Cache) ---
    const loadTemplates = async () => {
        // Рендерим индикатор загрузки
        canvas.innerHTML = '<div class="loader">Загрузка шаблонов...</div>';

        try {
            let data;
            if (navigator.onLine) {
                // Если онлайн — тянем с сервера
                const raw = await ApiService.fetchTemplates();
                data = DataParser.parseToDiagram(raw);
                StorageService.set(CONFIG.STORAGE_KEYS.TEMPLATES_CACHE, data);
            } else {
                // Если оффлайн — берем из кэша
                data = StorageService.get(CONFIG.STORAGE_KEYS.TEMPLATES_CACHE);
            }

            renderTemplatesUI(data);
        } catch (error) {
            canvas.innerHTML = '<div class="error">Ошибка подключения к API. Проверьте соединение.</div>';
        }
    };

    const renderTemplatesUI = (templates) => {
        if (!templates) return;
        // Здесь можно было бы отрисовать список кнопок в Aside
        showToast(`Загружено ${templates.length} шаблонов`, 'success');
        canvas.innerHTML = `<p style="padding: 1rem; color: #666">Кликните "AI Prompt" или введите код вручную. Шаблоны готовы в кеше.</p>`;
    };

    // Запускаем асинхронную загрузку
    loadTemplates();

    // --- ЧАСТЬ 3: Автосохранение черновика (LocalStorage) ---
    dslInput.value = StorageService.get(CONFIG.STORAGE_KEYS.DRAFT) || dslInput.value;
    
    dslInput.addEventListener('input', (e) => {
        StorageService.set(CONFIG.STORAGE_KEYS.DRAFT, e.target.value);
    });
});