document.addEventListener('DOMContentLoaded', () => {

    const modalTriggers = document.querySelectorAll('[aria-controls]');

    window.openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('modal--active', 'is-active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; 

            const firstInput = modal.querySelector('input, textarea, select, button');
            if (firstInput) setTimeout(() => firstInput.focus(), 300);
        }
    };

    window.closeModal = (modalOrId) => {
        const modal = typeof modalOrId === 'string' ? document.getElementById(modalOrId) : modalOrId;
        if (modal) {
            modal.classList.remove('modal--active', 'is-active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    };

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const controls = trigger.getAttribute('aria-controls');

            if (controls && !['mobile-menu', 'mobile-drawer', 'burger-toggle'].includes(controls)) {
                e.preventDefault();
                openModal(controls);
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal__overlay')) {
            closeModal(e.target.closest('.modal'));
        }
        if (e.target.closest('.modal__close') || e.target.hasAttribute('data-close')) {
            const modal = e.target.closest('.modal');
            closeModal(modal);
        }
    });

    const burgerBtn = document.getElementById('burger-btn') || document.getElementById('burger-trigger');
    const mobileMenu = document.getElementById('mobile-menu') || document.getElementById('mobile-drawer');
    const menuLinks = document.querySelectorAll('.header__menu-item, .header__menu-btn');

    if (burgerBtn && mobileMenu) {
        burgerBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('is-open');
            burgerBtn.setAttribute('aria-expanded', isOpen);

            const lines = burgerBtn.querySelectorAll('span');
            if (lines.length === 3) {
                lines[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
                lines[1].style.opacity = isOpen ? '0' : '1';
                lines[2].style.transform = isOpen ? 'rotate(-45deg) translate(7px, -6px)' : '';
            }
        });
    }

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('is-open');
            if (burgerBtn) burgerBtn.setAttribute('aria-expanded', 'false');
        });
    });

    const editorTextarea = document.getElementById('dsl-input') || document.getElementById('code-input');
    const lineNumbersContainer = document.getElementById('line-numbers') || document.querySelector('.editor__gutter');

    if (editorTextarea && lineNumbersContainer) {

        const updateLineNumbers = () => {
            const lines = editorTextarea.value.split('\n');
            lineNumbersContainer.innerHTML = lines
                .map((_, i) => `<div class="editor__line-number">${i + 1}</div>`)
                .join('');
        };

        editorTextarea.addEventListener('scroll', () => {
            lineNumbersContainer.scrollTop = editorTextarea.scrollTop;
        });

        editorTextarea.addEventListener('input', () => {
            updateLineNumbers();

            localStorage.setItem('diagram_code_buffer', editorTextarea.value);
        });

        editorTextarea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = editorTextarea.selectionStart;
                const end = editorTextarea.selectionEnd;
                editorTextarea.value = editorTextarea.value.substring(0, start) + "    " + editorTextarea.value.substring(end);
                editorTextarea.selectionStart = editorTextarea.selectionEnd = start + 4;
            }
        });

        const savedCode = localStorage.getItem('diagram_code_buffer');
        if (savedCode) {
            editorTextarea.value = savedCode;
        }

        updateLineNumbers();
    }

    document.addEventListener('keydown', (e) => {

        if ((e.altKey && e.code === 'KeyR') || (e.ctrlKey && e.code === 'Enter')) {
            e.preventDefault();
            const runBtn = document.getElementById('run-main') || document.querySelector('.button--run');
            if (runBtn) runBtn.click();
        }
        
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.is-active, .modal.modal--active');
            if (activeModal) closeModal(activeModal);
            if (mobileMenu) mobileMenu.classList.remove('is-open');
        }

        if (e.ctrlKey && e.code === 'KeyS') {
            e.preventDefault();
            showNotification('Project saved to local storage');
        }
    });

    function showNotification(message) {
        let toast = document.getElementById('app-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'app-notification';
            toast.style.cssText = `
                position: fixed; bottom: 60px; left: 50%; transform: translateX(-50%);
                background: #030213; color: white; padding: 10px 20px; border-radius: 20px;
                font-size: 13px; z-index: 9999; box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
            `;
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.style.opacity = '1';
        setTimeout(() => toast.style.opacity = '0', 2500);
    }

    const exportBtn = document.querySelector('#export-modal .button--primary');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const format = document.querySelector('input[name="fmt"]:checked')?.value || 'svg';
            exportBtn.disabled = true;
            exportBtn.textContent = 'Preparing...';
            
            setTimeout(() => {
                showNotification(`Diagram exported successfully as ${format.toUpperCase()}`);
                exportBtn.disabled = false;
                exportBtn.textContent = `Export as ${format.toUpperCase()}`;
                closeModal('export-modal');
            }, 1500);
        });
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
});