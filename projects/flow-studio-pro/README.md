# Flow-Studio-Pro [ACTIVE]

**Visual workflow builder с drag-and-drop flow editor и agent orchestration**

- **GitHub:** https://github.com/stsgs1980/Flow-Studio-Pro
- **Коммиты:** 2
- **Размер:** 1.1 MB
- **Стек:** Next.js 16, ReactFlow (@xyflow/react), Zustand, Prisma, z-ai-web-dev-sdk, shadcn/ui

---

## Что это (из worklog)

Visual workflow builder с русской локализацией. Drag-and-drop редактор потоков, 18 node types, execution engine, сохранение/загрузка.

### Реализовано

- **FlowCanvas** — React Flow с drag-and-drop, zoom, minimap, controls
- **18 node types** в 9 категориях:
  - Input: Ввод текста
  - Output: Вывод текста
  - Processing: LLM, JSON Парсер, Преобразование текста, Слияние
  - Agents: Агент, Суб-Агент
  - Tools: HTTP Запрос, Поиск, Функция
  - Conditions, Loops, Variables и др.
- **NodePalette** — боковая панель с категориями и поиском
- **NodeConfigPanel** — типоспецифичная конфигурация
- **FlowAssistant** — пошаговый гид создания потока
- **ExecutionPanel** — вход, выход, трассировка
- **API routes** — CRUD + execution engine через z-ai-web-dev-sdk
- **10 промпт-шаблонов** (RTF, TAG, BAB, CARE, RISE, SOAP, PARA, STAR, AIDA, CBA)
- **Горячие клавиши** — Ctrl+S, Ctrl+Enter, Ctrl+K

### Prisma Schema

Flow, FlowExecution, NodeTemplate, PromptTemplate, UserSession

## Что даёт 3A Studio

Flow Editor (Phase 3): ReactFlow паттерны, Zustand store, UI компоненты, 18 node types, 10 промпт-шаблонов.

## Связанные проекты

- [MVP-Flow-Studio-Pro](../_archived/mvp-flow-studio-pro/README.md) — lightweight прототип (10 node types, LLM APIs)
- [3A Studio](../3a-studio/README.md) — потребитель Flow Editor
- [P-MAS-architector](../p-mas-architector/README.md) — источник агентных паттернов
