/**
 * ==========================================================================
 * js/components/modal.js
 * Компонент управления модальными окнами (Использование делегирования событий)
 * ==========================================================================
 */

export function initModals() {
    // Делегирование событий клика на весь документ
    document.addEventListener('click', (event) => {
        
        // 1. ОТКРЫТИЕ МОДАЛЬНОГО ОКНА
        // Ищем ближайший элемент с атрибутом aria-controls
        const trigger = event.target.closest('[aria-controls]');
        
        // Исключаем кнопку бургер-меню (у нее своя логика)
        if (trigger && !trigger.id?.includes('burger')) {
            event.preventDefault();
            const modalId = trigger.getAttribute('aria-controls');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.add('is-active', 'modal--active'); // Добавляем классы активности
                document.body.style.overflow = 'hidden'; // Убираем скролл у body
            }
        }

        // 2. ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА
        // Проверяем клик по крестику, кнопке отмены (data-close) или по темному фону (overlay)
        const isCloseBtn = event.target.closest('.modal__close') || event.target.hasAttribute('data-close');
        const isOverlay = event.target.classList.contains('modal__overlay');
        
        if (isCloseBtn || isOverlay) {
            const modal = event.target.closest('.modal');
            if (modal) {
                modal.classList.remove('is-active', 'modal--active'); // Убираем классы активности
                document.body.style.overflow = ''; // Возвращаем скролл
            }
        }
    });

    // 3. ОБРАБОТКА КЛАВИАТУРЫ
    // Закрытие модальных окон при нажатии клавиши Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            // Находим все открытые модалки и закрываем их
            const activeModals = document.querySelectorAll('.modal.is-active, .modal.modal--active');
            activeModals.forEach(modal => {
                modal.classList.remove('is-active', 'modal--active');
                document.body.style.overflow = '';
            });
        }
    });
}