export const Storage = {
    save: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
    get: (key) => JSON.parse(localStorage.getItem(key))
};

// Функция создания уведомлений (Toasts)
export const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('toast--fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
};

// Валидация текста
export const validateText = (text, minLength = 5) => {
    return text.trim().length >= minLength;
};