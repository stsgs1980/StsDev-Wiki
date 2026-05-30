# Карта экосистемы

**Все 54 репозитория — классификация по группам и связям**

> Дата: 2026-05-30 (обновлено)

---

## Группы репозиториев

### Ядро экосистемы (7)

| Репо | Статус | Описание |
|------|--------|----------|
| 3a-studio | [NEW] | IDE для визуального построения multi-agent систем |
| P-MAS-architector | [ARCHIVED] | Источник @stsgs/prompting, skills, standards |
| P-MAS_init | [ARCHIVED] | Agent Hierarchy Dashboard — первая версия |
| Stanislav-graur | [ACTIVE] | Личный сайт (приватный) |
| StsDev-Wiki | [ACTIVE] | База знаний экосистемы (этот репо) |
| Zai-agent-toolkit | [REFERENCE] | Стандарты, навыки, правила для AI-разработки |
| Zai-agent-toolkit-by-PMAS | [ARCHIVED] | Ранняя версия toolkit |

### UI / Дизайн-системы (14)

| Репо | Описание |
|------|----------|
| Component-Browser | Интерактивный обозреватель UI-компонентов с живым предпросмотром |
| Component-Browser-Public-v1.0 | Публичная версия Component Browser |
| Hub | Command Center Hub — unified dashboard для 40+ проектов |
| UI-Kit | Foundation Component Library + Anti-monolith ESLint plugin + CLI |
| Zai-ui-kit | React UI компоненты для dark-themed dashboards |
| carbon-design-system-guide | Справочник дизайн-систем на основе Carbon |
| DS-Reference | Референс дизайн-систем |
| DesignSystems-Hub-industrial | Хаб промышленных дизайн-систем |
| Radix-Template | Next.js starter с Radix UI primitives + Tailwind |
| UI-MATRIX | UI матрица компонентов |
| UI-RADAR | UI радар — обзор экосистемы компонентов |
| Reverse-engineering | Реверс-инжиниринг UI |
| Design-extractor-toolkit | AI-инструмент для извлечения дизайна |
| UI-Library-Compare_V0app | Проект по сравнению UI библиотек |

### Flow / Агенты (3)

| Репо | Статус | Описание |
|------|--------|----------|
| Flow-Studio-Pro | [LOCAL] | Visual workflow builder, React Flow v12 |
| MVP-Flow-Studio-Pro | [ARCHIVED] | Lightweight прототип Flow Studio |
| agent-logo | — | Логотипы для агентов |

### Код-галереи / Эстетика (4)

| Репо | Описание |
|------|----------|
| Code-Aesthetic-Gallery-v2.0 | 32 interactive code tools и visual showcases |
| Code-Aesthetic-Gallery-v3.0 | v3.0 код-галерея |
| Code-Snippets-Gallery | Галерея сниппетов кода |
| web-aesthetic-showcase | Веб-шоукейс эстетики кода |

### Цвет / Визуальные инструменты (4)

| Репо | Описание |
|------|----------|
| Color-Picker-Panel | Color Picker |
| Color-Picker-Panel-Figma | Color Picker для Figma |
| Color-Picker-Panel-V2 | Color Picker v2 |
| energy-helix-3d | 3D визуализация |

### CSS / Layout (3)

| Репо | Описание |
|------|----------|
| CSS-Grid | CSS Grid справочник |
| 47-css-grids | 47 CSS Grid шаблонов |
| Layout-Explorer | AI-powered layout designer, wireframe preview |

### Обучение / Справочники (8)

| Репо | Описание |
|------|----------|
| Industrial-Style-Guide | Промышленный стайл-гайд |
| JavaScript-TypeScript | JS/TS справочник |
| Learning-Plan-Prompt-Generator | Генератор учебных планов |
| Learning-Prompt-Standardizer | Стандартизатор промптов для обучения |
| Llm-memory-techniques | 6 техник управления контекстом LLM |
| Rust-performance-optimization | Оптимизация Rust-кода с бенчмарками |
| UI-Stack-Guide | Гайд по UI-стеку |
| Z.Code.Guide | Интерактивный справочник Z Code platform |

### Портфолио (2)

| Репо | Описание |
|------|----------|
| Portfolio-Conversion | 42 компонента — анимации, 3D, particle system, GitHub graph |
| dev.studio-2-portfolio | Портфолио dev.studio |

### Пакеты (сырые) (2)

| Репо | Описание |
|------|----------|
| prompting-v0.0 | 20 когнитивных формул (сырой пакет) |
| zai-custom-skills | Custom skills для Z.ai (сырой пакет) |

### Утилиты / Тулкиты (3)

| Репо | Описание |
|------|----------|
| CodeMan | Code tools и terminal emulator, Next.js 16 |
| StsDev-Knowledge | База знаний (ранняя версия) |
| Token-command-center | Управление токенами |

### Заготовки проектов (4)

| Репо | Домен | Описание |
|------|-------|----------|
| Code-Realm | CLI | Заготовка CLI терминала |
| HH-Job-Copilot | HR | Заготовка проекта для HR |
| CHROMEDNA | Трейдинг | Заготовка проекта для трейдинга |
| Wiki-Codex-v2 | Wiki | Мини web-версия wiki |

---

## Статусы

| Статус | Значение |
|--------|----------|
| [ACTIVE] | Рабочий код, активно развивается |
| [NEW] | Greenfield, начало разработки |
| [REFERENCE] | Read-only, не модифицируем |
| [LOCAL] | Локальный исходник, не на GitHub |
| [ARCHIVED] | Мёртвый, не развивается |
| [PACKAGE] | Переиспользуемый пакет |

## Поток данных (ключевые связи)

| Из | Что | В | Для чего |
|----|-----|---|----------|
| P-MAS-architector | @stsgs/prompting | 3A Studio | Prompt Studio |
| P-MAS-architector | skills, standards | Zai-agent-toolkit | Governance |
| P-mas-studio (из P-MAS_init) | Компоненты, API, пакеты | 3A Studio | Экраны, backend, дизайн-система |
| Flow-Studio-Pro | React Flow v12, Zustand | 3A Studio | Flow Editor |
| MVP-Flow-Studio-Pro | EventBus, NodeExecutor | 3A Studio | Flow Editor backend |
| prompting-v0.0 | 20 когнитивных формул | @stsgs/prompting | Prompt Studio |
| Zai-agent-toolkit | 24 стандарта | 3A Studio (read-only) | Качество кода |
| Component-Browser | UI компоненты (~273) | @stsgs/ui | Wave 1-3 компонентов |
| UI-Kit | ESLint plugin, CLI | 3A Studio | Anti-monolith + инструменты |
| Zai-ui-kit | Dark-themed components | @stsgs/ui | Dashboard компоненты |

## Судьба проектов

| Проект | Перспектива |
|--------|-------------|
| 3A Studio | Берёт лучшее из каждого → основной продукт |
| Zai-agent-toolkit | Отдельный репо, переработка |
| StsDev-Wiki | Активный, ядро памяти |
| P-MAS-architector | Архив (код перенесён в пакеты) |
| P-MAS_init | Архив (эволюционировал в P-mas-studio → 3A Studio) |
| Flow-Studio-Pro | Исходник → архив после переноса |
| MVP-Flow-Studio-Pro | Архив |
| Component-Browser | Исходник для @stsgs/ui → архив после переноса |
