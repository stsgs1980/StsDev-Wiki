# MVP-Flow-Studio-Pro

**Расширенная MVP-2 версия Flow Editor — 18,193 LOC**

- **Статус:** [ARCHIVED]
- **GitHub:** https://github.com/stsgs1980/MVP-Flow-Studio-Pro
- **LOC:** 18,193
- **Стек:** ReactFlow, LLM APIs (OpenAI/Claude), WebSocket, TypeScript

---

## Что содержит (18,193 LOC)

### Flow Editor (расширенный)
- **10 node types** — Input, LLM, Switch, Merge, Loop, Webhook, Variable, DataSource, Output, Condition
- **AdvancedNodes.tsx** (357 LOC) — 6 продвинутых нод: Switch, Merge, Loop, DataSource, Webhook, Variable
- **NodeFactory.ts** (134 LOC) — создание нод с дефолтными данными
- **NodeExecutor.ts** (225 LOC) — топологическая сортировка + per-node execution
- **FlowEditor.tsx** (359 LOC) — основной редактор
- **CustomNodes.tsx** (231 LOC) — кастомные ноды по категориям

### Templates (26 multi-agent templates)
- **multi-agent-seed.ts** (887 LOC) — 10 multi-agent шаблонов: Researchers, Debates, Iterative Improvement, Expert Panels, и др.
- **templates-seed.ts** (375 LOC) — базовые flow templates
- **TemplateGallery.tsx** (750 LOC) — UI для поиска/фильтрации/категорий

### Infrastructure
- **EventBus.ts** (108 LOC) — pub/sub для node execution lifecycle
- **Node Type System** (487 LOC) — `types.ts`, `NodeFactory.ts`, `NodeExecutor.ts`
- **Flow Generation API** (162 LOC) — AI-powered flow creation
- **Version History** (345 LOC) — UI + API для flow versioning

### i18n
- **i18n System** (390 LOC) — EN/RU translations, 17+ namespaces

### Документация
- **MULTI_AGENT_GUIDE.md** (558 LOC) — руководство по multi-agent flows

## Что даёт 3A Studio

| Приоритет | Что | LOC | Для чего |
|-----------|-----|-----|----------|
| P0 | Advanced Nodes (6 типов) | 357 | Расширенные ноды Flow Editor |
| P0 | Multi-Agent Templates (10) | 887 | Исследователи, дебаты, экспертные панели |
| P0 | Node Type System + Factory | 487 | Инфраструктура flow engine |
| P1 | Template Gallery UI | 750 | UI поиска/фильтрации шаблонов |
| P1 | Version History (UI + API) | 345 | Flow versioning + restore |
| P1 | EventBus | 108 | Pub/sub для flow lifecycle |
| P1 | Flow Generation API | 162 | AI-powered flow creation |
| P2 | i18n System | 390 | EN/RU локализация |
| P2 | Basic Flow Templates | 375 | Базовые шаблоны |
| P2 | Multi-Agent Guide | 558 | Документация |

## Отличие от Flow-Studio-Pro

- **MVP-Flow-Studio-Pro** = расширенная MVP-2 версия: 10 нод, 26 шаблонов, i18n, topological sort
- **Flow-Studio-Pro** = базовая версия: 18 нод (9 категорий), 5 уникальных нод (Loop, Delay, Merge, SubAgent, Search), execution panel, русская локализация

Оба проекта — доноры 3A Studio. MVP даёт шаблоны и advanced nodes, Flow-Studio-Pro даёт уникальные ноды.

## Связанные проекты

- [Flow-Studio-Pro](../../flow-studio-pro/README.md) — базовая версия Flow Editor
- [3A Studio](../../3a-studio/README.md) — основной потребитель
- [P-MAS-architector](../../p-mas-architector/README.md) — источник агентных паттернов
