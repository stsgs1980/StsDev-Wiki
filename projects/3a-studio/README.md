# 3A Studio [ACTIVE]

**Artificial. Agentic. Architecture. — IDE для visual multi-agent systems**

- **GitHub:** https://github.com/stsgs1980/3a-studio
- **Коммиты:** 143
- **Стек:** Bun, PostgreSQL, ReactFlow, Next.js
- **Размер:** 699 KB

---

## Что это (из README)

IDE для визуального построения и управления multi-agent системами. Позволяет создавать потоки агентов через drag-and-drop редактор, оценивать промпты, работать с базой знаний и стандартами — всё на единой PostgreSQL базе.

### Ключевой принцип

Заменяет 3 репозитория x 110 навыков x ручная синхронизация → **одна база данных**.

### 12 экранов

1. Dashboard — обзор системы
2. Flow Editor — визуальный редактор потоков (React Flow, 18 node types)
3. Template Gallery — шаблоны пайплайнов
4. Agent Management — CRUD агентов
5. Agent Hierarchy — граф иерархии агентов
6. Pipelines — выполнение пайплайнов
7. Prompt Studio — оценка и улучшение промптов
8. Knowledge Base — загрузка документов и поиск
9. Skill Forge — управление навыками агентов
10. Standards Manager — управление стандартами
11. Audit Log — логи действий
12. Settings — настройки системы

### Модули

- Standards Manager — управление стандартами кода
- Skill Forge — создание/редактирование навыков
- Prompt Studio — оценка и генерация промптов
- Flow Editor — 18 node types, ReactFlow
- Knowledge Base — загрузка и поиск документов
- Audit Log — логирование действий

## Из чего собрано (синтез)

| Источник | Что взяли | Статус источника |
|----------|-----------|-----------------|
| P-MAS-architector | Компоненты, API routes, Prisma, packages/ui, CLI, ESLint, @stsgs/prompting | [ACTIVE] |
| Flow-Studio-Pro | React Flow v12 паттерны, Zustand | [ACTIVE] |
| MVP-Flow-Studio-Pro | EventBus, LLMProvider, Template Gallery | [ARCHIVED] |
| prompting-v0.0 | 20 когнитивных формул | [PACKAGE] |
| Zai-agent-toolkit | 24 стандарта, agent templates | [REFERENCE] |

## Принципы

1. **Greenfield** — новое с нуля, не дорабатываем старое
2. **Synthesis** — берём лучшее из каждого проекта
3. **Monorepo** — пакетное разделение с первого дня
4. **PostgreSQL-first** — единая БД вместо SQLite
5. **Desktop-ready** — Tauri обёртка как опцион

## Пакеты

| Пакет | Назначение | Подробнее |
|-------|-----------|-----------|
| @stsgs/ui | Дизайн-система | [packages/ui](../../packages/ui.md) |
| @stsgs/prompting | Библиотека оценок промптов | [packages/prompting](../../packages/prompting.md) |
| @stsgs/shared | Общие типы, утилиты, константы | [packages/shared](../../packages/shared.md) |
| eslint-plugin-3a | Кастомные ESLint правила | Часть 3A Studio |

## Документация проекта

- [Master Plan](master-plan.md) — план разработки по фазам
- [Требования](requirements.md) — специфические требования
- [Прогресс](progress.md) — текущий статус
- [Решения](decisions/) — ADRы по 3A Studio

## Связанные проекты

- [P-MAS-architector](../p-mas-architector/README.md) — текущий код (источник компонентов и пакетов)
- [Zai-agent-toolkit](../zai-agent-toolkit/README.md) — стандарты и навыки (read-only reference)
- [Карта экосистемы](../../ecosystem-map.md) — все связи между проектами
