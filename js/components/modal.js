const overlay = document.getElementById('overlay');
const modals = document.querySelectorAll('.modal');
const closeButtons = document.querySelectorAll('.close-btn, .modal__close');
const modalTriggers = document.querySelectorAll('[data-modal-target]');

const openModal = (modalId) => {
    const targetModal = document.getElementById(modalId);
    if (!targetModal) return;
    targetModal.classList.add('modal--active');
    overlay.classList.add('overlay--active');
    document.body.classList.add('no-scroll');
};

const closeAllModals = () => {
    modals.forEach(modal => modal.classList.remove('modal--active'));
    overlay.classList.remove('overlay--active');
    document.body.classList.remove('no-scroll');
};

modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal-target');
        openModal(modalId);
    });
});

closeButtons.forEach(btn => {
    btn.addEventListener('click', closeAllModals);
});

overlay.addEventListener('click', closeAllModals);

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
});
