import { DiagramAPI } from './api/apiService.js';
import { DataParser } from './api/dataParser.js';
import { Storage } from './utils/storage.js';
import { Validator } from './utils/validation.js';

document.addEventListener('DOMContentLoaded', () => {
    const dslEditor = document.getElementById('dslEditor');
    const runBtn = document.getElementById('runBtn');
    const canvas = document.getElementById('canvas');
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    const notationBtn = document.getElementById('notationBtn');
    const tabBtns = document.querySelectorAll('.tabs__btn');
    const codePanel = document.getElementById('codePanel');
    const diagramPanel = document.getElementById('diagramPanel');

    const savedCode = Storage.load(Storage.keys.CODE);
    if (savedCode) {
        dslEditor.value = savedCode;
    }

    const render = async () => {
        const code = dslEditor.value;
        const notation = notationBtn.getAttribute('data-current') || 'mermaid';

        if (!Validator.validateDSL(code)) {
            canvas.innerHTML = `<div class="error-msg">${Validator.getErrors()[0]}</div>`;
            return;
        }

        Storage.save(Storage.keys.CODE, code);
        canvas.innerHTML = '<div class="loader">Generating Diagram...</div>';

        try {
            const svg = await DiagramAPI.fetchDiagram(code, notation);
            canvas.innerHTML = svg;
            
            const stats = DataParser.parseDSL(code);
            console.log(`Rendered: ${stats.nodeCount} nodes, ${stats.edgeCount} edges`);
        } catch (err) {
            canvas.innerHTML = '<div class="error-msg">Connection error or invalid syntax</div>';
        }
    };

    runBtn.addEventListener('click', render);

    burgerBtn.addEventListener('click', () => {
        mobileMenu.classList.add('mobile-menu--active');
        document.getElementById('overlay').classList.add('overlay--active');
    });

    closeMenu.addEventListener('click', () => {
        mobileMenu.classList.remove('mobile-menu--active');
        document.getElementById('overlay').classList.remove('overlay--active');
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            
            tabBtns.forEach(b => b.classList.remove('tabs__btn--active'));
            btn.classList.add('tabs__btn--active');

            if (target === 'code') {
                codePanel.style.display = 'flex';
                diagramPanel.style.display = 'none';
            } else {
                codePanel.style.display = 'none';
                diagramPanel.style.display = 'flex';
                if (canvas.innerHTML === '') render();
            }
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            codePanel.style.display = 'flex';
            diagramPanel.style.display = 'flex';
        } else {
            const activeTab = document.querySelector('.tabs__btn--active').getAttribute('data-target');
            codePanel.style.display = activeTab === 'code' ? 'flex' : 'none';
            diagramPanel.style.display = activeTab === 'diagram' ? 'flex' : 'none';
        }
    });

    if (dslEditor.value) render();
});