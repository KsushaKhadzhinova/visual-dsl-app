export const ModalManager = {
    overlay: null,

    init() {
        this.overlay = document.getElementById('modal-overlay');
        const closeBtns = document.querySelectorAll('.modal__close');
        closeBtns.forEach(btn => btn.addEventListener('click', () => this.closeAll()));
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.closeAll();
        });
    },

    open(modalId) {
        if (!this.overlay) this.init();
        this.closeAll();
        const modal = document.getElementById(modalId);
        if (modal) {
            this.overlay.hidden = false;
            modal.hidden = false;
            document.body.style.overflow = 'hidden';
        }
    },

    closeAll() {
        if (!this.overlay) return;
        this.overlay.hidden = true;
        const modals = this.overlay.querySelectorAll('.modal');
        modals.forEach(m => m.hidden = true);
        document.body.style.overflow = '';
    }
};
