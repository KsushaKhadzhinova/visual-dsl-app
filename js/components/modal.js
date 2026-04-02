export const initModals = () => {
    const triggers = document.querySelectorAll('[aria-controls]');
    
    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('aria-controls');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('modal--active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Делегирование событий для закрытия
    document.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-close') || e.target.classList.contains('modal')) {
            const activeModal = document.querySelector('.modal--active');
            if (activeModal) {
                activeModal.classList.remove('modal--active');
                document.body.style.overflow = '';
            }
        }
    });
};