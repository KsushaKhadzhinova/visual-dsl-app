document.addEventListener('DOMContentLoaded', () => {
    const notationButton = document.getElementById('notation-button');
    const notationDropdown = document.querySelector('.dropdown-select__list');
    const exportButton = document.querySelector('[aria-controls="export-dialog"]');
    const exportDialog = document.getElementById('export-dialog');
    const aiButton = document.querySelector('[aria-controls="ai-prompt-panel"]');
    const aiPanel = document.getElementById('ai-prompt-panel');
    const closeButtons = document.querySelectorAll('.button--close');
    const runButton = document.querySelector('.button--run');

    const toggleElement = (element, forceClose = false) => {
        if (!element) return;
        if (forceClose) {
            element.style.display = 'none';
        } else {
            const isHidden = window.getComputedStyle(element).display === 'none';
            element.style.display = isHidden ? 'block' : 'none';
        }
    };

    notationButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleElement(notationDropdown);
        notationButton.setAttribute('aria-expanded', notationDropdown.style.display === 'block');
    });

    exportButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleElement(exportDialog);
    });

    aiButton.addEventListener('click', (e) => {
        e.stopPropagation();
        aiPanel.classList.toggle('active');
        const isActive = aiPanel.classList.contains('active');
        aiPanel.style.bottom = isActive ? '0' : '-300px';
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            aiPanel.classList.remove('active');
            aiPanel.style.bottom = '-300px';
            toggleElement(exportDialog, true);
        });
    });

    document.addEventListener('click', (e) => {
        if (!notationButton.contains(e.target)) {
            toggleElement(notationDropdown, true);
            notationButton.setAttribute('aria-expanded', 'false');
        }
        if (exportDialog && !exportDialog.contains(e.target) && e.target !== exportButton) {
            toggleElement(exportDialog, true);
        }
    });

    runButton.addEventListener('click', () => {
        const svg = document.querySelector('.diagram-preview__svg');
        svg.style.opacity = '0.5';
        setTimeout(() => {
            svg.style.opacity = '1';
            console.log('Diagram re-rendered');
        }, 300);
    });

    const notationOptions = document.querySelectorAll('.dropdown-select__option');
    notationOptions.forEach(option => {
        option.addEventListener('click', () => {
            document.querySelector('.dropdown-select__current').textContent = option.textContent;
            toggleElement(notationDropdown, true);
        });
    });
});