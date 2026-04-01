/**
 * ==========================================================================
 * js/components/editor.js
 * Компонент текстового редактора (Синхронизация, LocalStorage, горячие клавиши)
 * ==========================================================================
 */

import { saveToStorage, getFromStorage } from '../utils/helpers.js';

export function initEditor() {
    // Ищем поле ввода кода и контейнер для номеров строк
    // Поддерживаем разные ID для совместимости (в зависимости от вашей верстки)
    const editor = document.getElementById('code-input') || document.getElementById('dsl-input');
    const lineNumbers = document.getElementById('line-numbers');
    
    // Ключ, по которому данные будут храниться в LocalStorage
    const STORAGE_KEY = 'diagramcode_draft';

    if (!editor || !lineNumbers) return;

    // Дефолтный код для первой загрузки
    const defaultCode = `graph TD\n    A[Start] --> B{Is it working?}\n    B -->|Yes| C[Great!]\n    B -->|No| D[Debug]\n    D --> B\n    C --> E[End]`;

    /**
     * 1. Функция обновления номеров строк
     * Высчитывает количество переводов каретки и рендерит нужный HTML
     */
    const updateLineNumbers = () => {
        const linesCount = editor.value.split('\n').length;
        lineNumbers.innerHTML = Array.from({ length: linesCount }, (_, i) => `<div>${i + 1}</div>`).join('');
    };

    /**
     * 2. Инициализация (Чтение из LocalStorage)
     */
    const savedCode = getFromStorage(STORAGE_KEY);
    // Если в LocalStorage что-то было, вставляем это. Иначе — дефолтный код.
    editor.value = savedCode !== null ? savedCode : defaultCode;
    updateLineNumbers();

    /**
     * 3. Обработка события ввода (Input)
     */
    editor.addEventListener('input', (event) => {
        updateLineNumbers();
        // Сохраняем введенные данные в браузере при каждом изменении
        saveToStorage(STORAGE_KEY, event.target.value);
    });

    /**
     * 4. Синхронизация прокрутки (Scroll)
     */
    editor.addEventListener('scroll', () => {
        // Синхронизируем положение скролла номеров строк со скроллом текстового поля
        lineNumbers.scrollTop = editor.scrollTop;
    });

    /**
     * 5. Обработка нажатий специальных клавиш (Keydown)
     */
    editor.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            // Отменяем стандартное поведение Tab (переключение фокуса на следующий элемент)
            event.preventDefault();
            
            const start = this.selectionStart;
            const end = this.selectionEnd;
            
            // Вставляем 4 пробела вместо табуляции на позицию курсора
            this.value = this.value.substring(0, start) + "    " + this.value.substring(end);
            
            // Перемещаем каретку на 4 позиции вперед после вставки
            this.selectionStart = this.selectionEnd = start + 4;
            
            // Обновляем номера строк
            updateLineNumbers();
            
            // Принудительно сохраняем изменения в LocalStorage
            saveToStorage(STORAGE_KEY, this.value);
        }
    });
}