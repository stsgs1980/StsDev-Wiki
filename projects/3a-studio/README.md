# 3A Studio [NEW]

**Artificial. Agentic. Architecture.**

- **Домен:** 3a-studio.dev / 3a.studio
- **GitHub:** https://github.com/stsgs1980/3a-studio
- **Статус:** Phase 0 завершена — monorepo, 4 пакета, Prisma, 12 экранов
- **Тип:** Web-приложение (Next.js 16), опционально desktop (Tauri)

---

## Что это

3A Studio — IDE для визуального построения и управления multi-agent системами. Позволяет создавать потоки агентов (через визуальный редактор), управлять агентами, оценивать промпты, работать с базой знаний.

12 экранов:
1. Dashboard — обзор системы
2. Flow Editor — визуальный редактор потоков (React Flow)
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

## Из чего собрано (синтез)

| Источник | Что взяли | Статус источника |
|----------|-----------|-----------------|
| P-mas-studio | Компоненты, API routes, Prisma, packages/ui, CLI, ESLint | [ACTIVE] |
| P-MAS-architector | @stsgs/prompting, skills, standards | [ARCHIVED] |
| Flow-Studio-Pro | React Flow v12 паттерны, Zustand | [LOCAL] |
| MVP-Flow-Studio-Pro | EventBus, LLMProvider, Template Gallery | [LOCAL → ARCHIVED] |
| prompting-v0.0 | 20 когнитивных формул | [ARCHIVED] |
| Zai-agent-toolkit | 19 стандартов, agent templates | [REFERENCE] |

## Принципы

1. **Greenfield** — новое с нуля, не дорабатываем старое
2. **Synthesis** — берём лучшее из каждого проекта
3. **Monorepo** — пакетное разделение с первого дня
4. **Sandbox-first** — SQLite + bun, потом PostgreSQL
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
- [Экраны](screens.md) — 12 экранов
- [Требования](requirements.md) — специфические требования
- [Прогресс](progress.md) — текущий статус
- [Решения](decisions/) — ADRы по 3A Studio

## План разработки

Подробный план: [3A Studio Master Plan](master-plan.md)

| Phase | Описание | Срок |
|-------|----------|------|
| Phase 0 | Фундамент (monorepo, пакеты, Prisma) | 2-3 дня |
| Phase 1 | Роутинг и навигация | 1-2 дня |
| Phase 2 | Очистка (удаление мёртвого кода) | 1 день |
| Phase 3 | Flow Editor (18 node types, drag&drop) | 2-3 недели |
| Phase 4 | Dashboard (метрики, API) | 1 неделя |
| Phase 5 | Agent Management (CRUD) | 1 неделя |
| Phase 6 | Knowledge Base (upload, search) | 1-2 недели |
| Phase 7 | Остальные экраны (6 штук) | по 3-5 дней |
| Phase 8 | Инфраструктура (auth, i18n, тесты, deploy) | 1-2 недели |

**MVP:** Phase 0-2 + Phase 4-5 = ~2-3 недели
**Полный продукт:** ~8-12 недель

## Связанные проекты

- [P-mas-studio](../p-mas-studio/README.md) — текущий код (источник компонентов)
- [Zai-agent-toolkit](../zai-agent-toolkit/README.md) — стандарты и навыки (read-only reference)
- [Карта экосистемы](../../ecosystem-map.md) — все связи между проектами
