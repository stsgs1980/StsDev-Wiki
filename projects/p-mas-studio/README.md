# P-mas-studio [ACTIVE]

**Рабочий репозиторий — крупнейший проект экосистемы**

- **GitHub:** https://github.com/stsgs1980/P-mas-studio
- **Коммиты:** 105
- **Файлов:** 1,066
- **Судьба:** Источник для 3A Studio, потом архив

---

## Что внутри

### Рабочие экраны (переносим в 3A Studio)
- **Dashboard** (src/app/page.tsx) -- KPI, графики, timeline
- **Hierarchy** (src/app/hierarchy/page.tsx) -- React Flow граф агентов
- **Prompt Studio** (src/components/prompt-studio/) -- компоненты есть, но НЕТ роута
- **Workflows** (src/components/workflows/) -- частично работает

### Пакеты (переносим как есть)
- **packages/ui/** -- 276 файлов, 31 feature-модуль (gauge, sparkline, force-graph, IDE layout)
- **packages/cli/** -- CLI инструмент (add, ai, list, recommend, scan, theme)
- **packages/eslint-plugin/** -- 4 правила (max-lines, max-use-state, no-cross-layer, no-unicode)

### API routes (19 штук, работают)
- /api/agents -- CRUD
- /api/tasks -- CRUD
- /api/hierarchy -- дерево данных
- /api/stats -- агрегированные метрики
- /api/workflows/execute -- выполнение пайплайнов
- /api/prompting -- интерпретация промптов

### Проблемы (РЕШАЕМ в 3A Studio)
- **Навигация сломана** -- useState('dashboard' | 'hierarchy') вместо Next.js routing
- **3,455 строк мёртвого кода** -- agent-hierarchy.tsx (заменён на hierarchy/ директорию)
- **Дублированные layouts** -- layout/features/, layout/sections/, layout/app-shell.tsx
- **Нет Prompt Studio роута** -- компоненты есть, но не подключены
- **Нет авторизации**
- **Нет тестов**

### Что НЕ переносим
- agent-hierarchy.tsx (3,455 строк мёртвого кода)
- layout/features/ (мёртвый код)
- layout/app-shell.tsx (мёртвый код)
- layout/sections/ (дубликаты)
- 87+ skills из toolkit (оставляем в toolkit)
- Архивы (документация уже перенесена в wiki)
