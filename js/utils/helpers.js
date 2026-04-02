export const validateText = (text, minLength = 3) => {
    return text.trim().length >= minLength;
};

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const saveToStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};

export const getFromStorage = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        return null;
    }
};

export const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '2.5rem',
        right: '2rem',
        backgroundColor: type === 'success' ? '#10B981' : (type === 'error' ? '#EF4444' : '#030213'),
        color: 'white',
        padding: '0.875rem 1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        zIndex: '9999',
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.875rem',
        fontWeight: '500',
        pointerEvents: 'none'
    });
    
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

export const setElementError = (element, message) => {
    element.style.borderColor = '#EF4444';
    let errorEl = element.nextElementSibling;
    
    if (!errorEl || !errorEl.classList.contains('error-text')) {
        errorEl = document.createElement('span');
        errorEl.className = 'error-text';
        Object.assign(errorEl.style, {
            color: '#EF4444',
            fontSize: '0.75rem',
            marginTop: '0.25rem',
            display: 'block'
        });
        element.parentNode.appendChild(errorEl);
    }
    errorEl.textContent = message;
};

export const clearElementError = (element) => {
    element.style.borderColor = '';
    const errorEl = element.nextElementSibling;
    if (errorEl && errorEl.classList.contains('error-text')) {
        errorEl.remove();
    }
};