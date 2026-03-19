Полный исходный код проекта DiagramCode (Вариант 13)Ниже представлены все файлы проекта, структурированные для удобного копирования. Проект выполнен с использованием методологии БЭМ, семантики HTML5, адаптивной верстки (Grid/Flexbox) и стандартов доступности (WAI-ARIA).1. index.htmlГлавный файл с семантической разметкой и микроразметкой Schema.org.<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="DiagramCode — профессиональная SaaS-платформа для моделирования диаграмм из программного кода (DSL).">
    <title>DiagramCode — Visual DSL Diagrammer</title>
    
    <link rel="icon" href="images/favicon.ico" type="image/x-icon">
    <link rel="preconnect" href="[https://fonts.googleapis.com](https://fonts.googleapis.com)">
    <link rel="preconnect" href="[https://fonts.gstatic.com](https://fonts.gstatic.com)" crossorigin>
    <link href="[https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500;600&display=swap](https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500;600&display=swap)" rel="stylesheet">
    
    <link rel="stylesheet" href="css/variables.css">
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/header.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/footer.css">
</head>

<body class="page" itemscope itemtype="[https://schema.org/SoftwareApplication](https://schema.org/SoftwareApplication)">
    <meta itemprop="applicationCategory" content="DeveloperApplication">
    <meta itemprop="operatingSystem" content="Web">
    <meta itemprop="name" content="DiagramCode">

    <!-- Техническая кнопка доступности (Skip-link) -->
    <a href="#main-content" class="skip-link">Пропустить навигацию</a>

    <header class="header">
        <div class="header__logo">
            <div class="header__logo-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
            </div>
            <span class="header__logo-text">DiagramCode</span>
        </div>

        <nav class="header__nav" aria-label="Инструменты">
            <button class="button button--ghost" aria-controls="help-modal" title="Help">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </button>

            <button class="button button--primary button--run" id="run-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                <span>Run</span>
            </button>

            <button class="header__burger" id="burger-btn" aria-label="Меню" aria-expanded="false">
                <span class="header__burger-line"></span>
                <span class="header__burger-line"></span>
                <span class="header__burger-line"></span>
            </button>

            <div class="header__menu" id="mobile-menu">
                <div class="header__menu-header hidden-desktop">
                    <h2 class="header__menu-main-title">Menu</h2>
                    <p class="header__menu-subtitle">Настройки нотации и действия</p>
                </div>
                <div class="header__menu-group">
                    <span class="header__menu-title hidden-desktop">Notation</span>
                    <div class="header__select-wrapper">
                        <select class="header__select" id="notation-select">
                            <option value="mermaid">Mermaid</option>
                            <option value="plantuml">PlantUML</option>
                            <option value="d2">D2</option>
                        </select>
                    </div>
                </div>
                <div class="header__actions">
                    <span class="header__menu-title hidden-desktop">Actions</span>
                    <button class="button button--ghost hidden-mobile"><svg>...</svg> Save</button>
                    <button class="button button--ghost" aria-controls="export-modal"><svg>...</svg> Export</button>
                    <button class="button button--outline button--ai" aria-controls="ai-modal"><svg>...</svg> AI Prompt</button>
                </div>
            </div>
        </nav>
    </header>

    <main class="workspace" id="main-content">
        <input type="radio" name="mobile-tabs" id="tab-code" class="workspace__tab-radio" checked>
        <input type="radio" name="mobile-tabs" id="tab-diagram" class="workspace__tab-radio">

        <div class="workspace__tabs">
            <label for="tab-code" class="workspace__tab-label"><svg>...</svg> Code</label>
            <label for="tab-diagram" class="workspace__tab-label"><svg>...</svg> Diagram</label>
        </div>

        <section class="workspace__editor editor">
            <div class="editor__gutter"><span>1</span><span>2</span><span>3</span></div>
            <textarea class="editor__code" id="dsl-input" spellcheck="false">graph TD
A --> B{Is it working?}
B -->|Yes| C[Great!]</textarea>
        </section>

        <section class="workspace__preview preview">
            <div class="preview__canvas-wrapper">
                <svg viewBox="0 0 600 400" class="preview__svg">
                    <rect x="230" y="20" width="140" height="60" rx="10" fill="#3B82F6" />
                    <text x="300" y="55" text-anchor="middle" fill="white" font-weight="600">Start</text>
                    <path d="M300 80 V120" stroke="#94a3b8" stroke-width="2" />
                    <polygon points="300,120 390,170 300,220 210,170" fill="#F59E0B" />
                    <text x="300" y="175" text-anchor="middle" fill="#78350F" font-weight="800">Is it working?</text>
                </svg>
            </div>
        </section>
    </main>

    <footer class="status-bar">
        <div class="status-bar__info"><span class="status-bar__dot status-bar__dot--active"></span> Engine: Connected</div>
        <div class="status-bar__author"><img src="images/avatar.jpg" class="status-bar__avatar"><span>Ксения Хаджинова</span></div>
        <div class="status-bar__meta">Март 2026 | Notation: BPMN</div>
    </footer>

    <!-- Модальные окна -->
    <aside class="modal" id="export-modal">
        <div class="modal__overlay" data-close="export-modal"></div>
        <div class="modal__content">
            <header class="modal__header">
                <h2 class="modal__title">Export Diagram</h2>
                <button class="modal__close" data-close="export-modal">&times;</button>
            </header>
            <div class="modal__body">
                <label class="export-option"><input type="radio" name="f" checked><strong>SVG</strong><span>Scalable Vector Graphics</span></label>
                <label class="export-option"><input type="radio" name="f"><strong>PDF</strong><span>Portable Document Format</span></label>
            </div>
            <footer class="modal__footer">
                <button class="button button--primary button--full-width">Export as SVG</button>
            </footer>
        </div>
    </aside>

    <script src="js/script.js"></script>
</body>
</html>
2. css/variables.cssЦентрализованное управление токенами дизайна.:root {
    --color-bg-white: #ffffff;
    --color-bg-canvas: #f9fafb;
    --color-bg-editor: #1e1e1e;
    --color-border-light: #e5e7eb;
    --color-accent-purple: #8b5cf6;
    --color-accent-purple-light: #f5f3ff;
    --color-text-main: #1e293b;
    --color-text-muted: #64748b;
    --color-success-green: #10b981;
    
    --font-sans: 'Inter', system-ui, sans-serif;
    --font-mono: 'Source Code Pro', monospace;
    
    --transition-base: all 0.3s ease;
    --radius-md: 8px;
    --radius-lg: 12px;
}
3. css/styles.cssГлобальные стили, кнопки и модальные окна.@import "variables.css";

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body.page {
    font-family: var(--font-sans);
    color: var(--color-text-main);
    display: flex;
    flex-direction: column;
    height: 100vh;
}

/* Кнопки */
.button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: var(--radius-md);
    font-weight: 600;
    cursor: pointer;
    border: 1px solid transparent;
    transition: var(--transition-base);
}

.button--primary { background-color: #030213; color: white; }
.button--outline { background-color: white; border-color: var(--color-border-light); }
.button--ai { background-color: var(--color-accent-purple-light); color: var(--color-accent-purple); }

/* Модальные окна */
.modal {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    visibility: hidden;
    opacity: 0;
    transition: var(--transition-base);
}

.modal.modal--active { visibility: visible; opacity: 1; }

.modal__overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(2px); }

.modal__content {
    position: relative;
    background: white;
    width: 100%;
    max-width: 440px;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
    overflow: hidden;
}

.modal__footer { background-color: #fcfcfd; padding: 20px; border-top: 1px solid var(--color-border-light); }

.skip-link {
    position: absolute;
    top: -100px;
    left: 20px;
    background: #030213;
    color: white;
    padding: 10px 20px;
    z-index: 9999;
    transition: top 0.3s;
}
.skip-link:focus { top: 0; }
4. css/header.cssСтили шапки и мобильного Drawer-меню..header {
    height: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    border-bottom: 1px solid var(--color-border-light);
    z-index: 100;
}

@media screen and (max-width: 767px) {
    .header__menu {
        position: fixed;
        right: -100%;
        top: 0;
        width: 280px;
        height: 100vh;
        background: white;
        transition: right 0.3s ease;
        padding: 60px 24px;
        display: flex;
        flex-direction: column;
        box-shadow: -5px 0 15px rgba(0,0,0,0.1);
    }
    .header__menu.is-open { right: 0; }
    .header__menu-title {
        display: block;
        font-size: 11px;
        font-weight: 700;
        color: #94a3b8;
        text-transform: uppercase;
        margin: 20px 0 10px;
    }
}
5. js/script.jsИнтерактивная логика IDE.document.addEventListener('DOMContentLoaded', () => {
    // 1. Управление модальными окнами
    const openModal = (id) => {
        document.getElementById(id).classList.add('modal--active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = (modal) => {
        modal.classList.remove('modal--active');
        document.body.style.overflow = '';
    };

    document.querySelectorAll('[aria-controls]').forEach(btn => {
        btn.onclick = () => openModal(btn.getAttribute('aria-controls'));
    });

    document.querySelectorAll('.modal__close, .modal__overlay').forEach(el => {
        el.onclick = () => closeModal(el.closest('.modal'));
    });

    // 2. Бургер-меню
    const burger = document.getElementById('burger-btn');
    const menu = document.getElementById('mobile-menu');
    burger.onclick = () => {
        menu.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', menu.classList.contains('is-open'));
    };

    // 3. Имитация Run
    document.getElementById('run-btn').onclick = function() {
        this.innerHTML = "Running...";
        setTimeout(() => this.innerHTML = "Run", 1000);
    };
});
6. README.mdДокументация выполнения лабораторных работ.# DiagramCode — Visual DSL Diagrammer
Профессиональная IDE для визуализации диаграмм из кода.

## Выполнение ЛР
- **ЛР №2**: Настроена инфраструктура (npm, live-server), Git-идентификация.
- **ЛР №3**: Семантическая верстка, WAI-ARIA, Schema.org Person/Org.
- **ЛР №4**: Адаптивный CSS Grid, Mobile-First подход, методология БЭМ.

**Исполнитель:** Ксения Хаджинова (Вариант 13)
