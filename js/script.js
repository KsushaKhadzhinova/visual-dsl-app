/**
 * ==========================================================================
 * js/script.js
 * Главный скрипт приложения (Точка входа)
 * Сборка модулей, обработка событий, валидация форм и асинхронные запросы.
 * ==========================================================================
 */

import { initModals } from './components/modal.js';
import { initEditor } from './components/editor.js';
import { validateEmail, showToast, showError, clearError } from './utils/helpers.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. ИНИЦИАЛИЗАЦИЯ КОМПОНЕНТОВ
    initModals();
    initEditor();

    // Инициализация векторных иконок Lucide (если библиотека подключена)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ----------------------------------------------------------------------
       2. ИМИТАЦИЯ ДВИЖКА (ASYNC / AWAIT)
       Обработка клика по кнопке Run с визуальными эффектами загрузки
       ---------------------------------------------------------------------- */
    const runBtn = document.getElementById('run-main') || document.querySelector('.button--run');
    const svgContainer = document.getElementById('diagram-container') || document.getElementById('canvas-root');

    // Функция-заглушка для имитации задержки сервера
    const mockApiCall = () => new Promise(resolve => setTimeout(resolve, 1500));

    if (runBtn && svgContainer) {
        runBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const originalHtml = this.innerHTML;
            
            // Меняем состояние кнопки
            this.innerHTML = '<i data-lucide="loader" class="spin"></i> Загрузка...';
            this.disabled = true;
            
            // Добавляем эффект размытия для холста
            svgContainer.style.transition = 'all 0.3s ease';
            svgContainer.style.opacity = '0.4';
            svgContainer.style.filter = 'blur(4px)';

            try {
                // Ожидание завершения "запроса"
                await mockApiCall();
                showToast('Схема успешно скомпилирована!', 'success');
            } catch (error) {
                showToast('Ошибка компиляции диаграммы', 'error');
                console.error(error);
            } finally {
                // Блок finally выполнится в любом случае (успех или ошибка)
                this.innerHTML = originalHtml;
                this.disabled = false;
                svgContainer.style.opacity = '1';
                svgContainer.style.filter = 'none';
                
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons(); // Перерисовываем иконки
                }
            }
        });
    }

    /* ----------------------------------------------------------------------
       3. ВАЛИДАЦИЯ ФОРМ (События blur, input, submit)
       ---------------------------------------------------------------------- */
    const aiForm = document.getElementById('ai-form');
    const emailInput = document.getElementById('ai-email');
    const promptInput = document.getElementById('ai-prompt');

    if (aiForm && emailInput && promptInput) {
        
        // Валидация Email при потере фокуса (Blur)
        emailInput.addEventListener('blur', function() {
            clearError(this);
            if (this.value.trim() !== '' && !validateEmail(this.value)) {
                showError(this, 'Введите корректный email адрес');
            }
        });

        // Снятие ошибки при вводе текста (Input)
        promptInput.addEventListener('input', function() {
            if (this.value.trim().length >= 10) {
                clearError(this);
            }
        });

        // Валидация при отправке формы (Submit)
        aiForm.addEventListener('submit', function(event) {
            // Отменяем стандартное поведение браузера (перезагрузку страницы)
            event.preventDefault();
            let isValid = true;

            // Проверка поля Email
            clearError(emailInput);
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Email обязателен для отправки результата');
                isValid = false;
            } else if (!validateEmail(emailInput.value)) {
                showError(emailInput, 'Введите корректный email адрес');
                isValid = false;
            }

            // Проверка поля Описания
            clearError(promptInput);
            if (promptInput.value.trim().length < 10) {
                showError(promptInput, 'Описание должно содержать минимум 10 символов');
                isValid = false;
            }

            // Если форма валидна — имитируем отправку
            if (isValid) {
                // Сбор данных формы
                const formData = new FormData(this);
                console.log('Данные формы для отправки:', Object.fromEntries(formData));
                
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Генерация...';

                setTimeout(() => {
                    // Закрытие модального окна
                    const modal = document.getElementById('ai-modal');
                    if (modal) {
                        modal.classList.remove('is-active', 'modal--active');
                    }
                    document.body.style.overflow = '';
                    
                    // Показ уведомления и очистка формы
                    showToast('Задача отправлена нейросети. Ожидайте письмо!', 'success');
                    aiForm.reset();
                    
                    // Возврат кнопки в исходное состояние
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }, 1500);
            }
        });
    }

    /* ----------------------------------------------------------------------
       4. ДИНАМИЧЕСКОЕ ОБНОВЛЕНИЕ ИНТЕРФЕЙСА (Событие change)
       ---------------------------------------------------------------------- */
    const notationSelect = document.getElementById('notation-select');
    const displayNotation = document.getElementById('current-notation-display');
    
    if (notationSelect && displayNotation) {
        notationSelect.addEventListener('change', (e) => {
            // Получаем текст выбранного option
            const selectedText = e.target.options[e.target.selectedIndex].text;
            
            // Динамически обновляем текст в статус-баре (footer)
            displayNotation.textContent = selectedText;
            
            // Показываем уведомление
            showToast(`Движок нотации изменен на ${selectedText}`);
        });
    }
});