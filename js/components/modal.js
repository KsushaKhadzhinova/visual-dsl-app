export function initModals() {
    document.addEventListener('click', (event) => {
        const trigger = event.target.closest('[aria-controls]');
        
        if (trigger && !trigger.id.includes('burger')) {
            const modalId = trigger.getAttribute('aria-controls');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.add('is-active');
                document.body.style.overflow = 'hidden';
            }
        }

        const isCloseAction = event.target.closest('.modal__close') || 
                             event.target.hasAttribute('data-close') || 
                             event.target.classList.contains('modal__overlay');
        
        if (isCloseAction) {
            const modal = event.target.closest('.modal');
            if (modal) {
                modal.classList.remove('is-active');
                document.body.style.overflow = '';
            }
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const activeModal = document.querySelector('.modal.is-active');
            if (activeModal) {
                activeModal.classList.remove('is-active');
                document.body.style.overflow = '';
            }
        }
    });
}