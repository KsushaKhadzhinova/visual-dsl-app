/**
 * ==========================================================================
 * js/utils/helpers.js
 * Вспомогательные функции: валидация, LocalStorage, манипуляции DOM
 * ==========================================================================
 */

// 1. Валидация Email (Регулярные выражения из требований ЛР5)
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// 2. Работа с LocalStorage (Сохранение и извлечение данных)
export const saveToStorage = (key, data) => {
    try {
        // Преобразуем данные в строку JSON перед сохранением
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Ошибка сохранения в LocalStorage:', error);
    }
};

export const getFromStorage = (key) => {
    try {
        const item = localStorage.getItem(key);
        // Возвращаем распарсенный объект или null, если данных нет
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Ошибка чтения из LocalStorage:', error);
        return null;
    }
};

// 3. Создание DOM элементов: Динамическое всплывающее уведомление (Toast)
export const showToast = (message, type = 'success') => {
    // Создаем новый элемент div
    const toast = document.createElement('div');
    
    // Использование Object.assign для множественной установки стилей напрямую
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        backgroundColor: type === 'success' ? '#10B981' : '#EF4444', // Зеленый для успеха, красный для ошибки
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '9999',
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'all 0.3s ease',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        fontWeight: '500'
    });
    
    toast.textContent = message;
    
    // Добавление созданного элемента в конец <body>
    document.body.appendChild(toast);

    // Анимация плавного появления
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    // Автоматическое удаление элемента из DOM после 3 секунд
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        // Ждем завершения CSS-транзиции перед физическим удалением
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// 4. Функции показа/скрытия ошибок инпутов (Манипуляция DOM узлами)
export const showError = (element, message) => {
    // Окрашиваем рамку инпута в красный цвет
    element.style.borderColor = '#EF4444';
    
    // Проверяем, существует ли уже элемент с текстом ошибки после инпута
    let errorEl = element.nextElementSibling;
    
    // Если элемента нет, создаем его
    if (!errorEl || !errorEl.classList.contains('error-message')) {
        errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        Object.assign(errorEl.style, {
            color: '#EF4444',
            fontSize: '12px',
            marginTop: '4px'
        });
        
        // Вставляем созданный элемент ошибки сразу после поля ввода
        element.parentNode.appendChild(errorEl);
    }
    
    errorEl.textContent = message;
};

export const clearError = (element) => {
    // Возвращаем стандартный цвет рамки
    element.style.borderColor = '';
    
    // Находим элемент ошибки
    const errorEl = element.nextElementSibling;
    
    // Если это действительно сообщение об ошибке - удаляем его из DOM
    if (errorEl && errorEl.classList.contains('error-message')) {
        errorEl.remove();
    }
};