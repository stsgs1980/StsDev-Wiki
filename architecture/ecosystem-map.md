# Карта экосистемы

**Как все проекты связаны между собой**

> Дата: 2026-05-27

---

## Текущая экосистема (7 проектов)

```
                    ┌──────────────────────┐
                    │    3A Studio (NEW)    │  <-- Главный проект
                    │   Greenfield, mono    │
                    └──────────┬───────────┘
                               │ берёт лучшее из каждого
              ┌────────────────┼────────────────┐
              v                v                 v
    ┌─────────────────┐ ┌──────────┐ ┌──────────────────┐
    │  P-mas-studio   │ │  Flow-   │ │  Zai-agent-      │
    │  (105 коммитов) │ │  Studio  │ │  toolkit v2.0.5  │
    │  Рабочий код    │ │  Pro     │ │  Стандарты       │
    │  1066 файлов    │ │  Локально│ │  (read-only ref) │
    └────────┬────────┘ └────┬─────┘ └──────────────────┘
             │               │
             v               v
    ┌─────────────────┐ ┌──────────────┐
    │ P-MAS-architector│ │ MVP-Flow-    │
    │ Архив           │ │ Studio-Pro   │
    │ @stsgs/prompting│ │ Локально     │
    └────────┬────────┘ └──────┬───────┘
             │                  │
             v                  v
    ┌─────────────────┐ ┌──────────────┐
    │ prompting-v0.0  │ │ Component-   │
    │ Локально        │ │ Browser      │
    │ 20 формул       │ │ (для @stsgs/ │
    └─────────────────┘ │  ui)         │
                        └──────────────┘
```

## Поток данных

| Из | Что | В | Для чего |
|----|-----|---|----------|
| P-mas-studio | Компоненты hierarchy, dashboard, prompt-studio | 3A Studio | Экраны 1, 4, 5, 7 |
| P-mas-studio | packages/ui (276 файлов) | 3A Studio / @stsgs/ui | Дизайн-система |
| P-mas-studio | packages/cli, eslint-plugin | 3A Studio | Инструменты |
| P-mas-studio | API routes (19 штук) | 3A Studio | Backend |
| P-mas-studio | Prisma schema (7 моделей) | 3A Studio | Данные |
| P-MAS-architector | @stsgs/prompting (30+ файлов) | 3A Studio / @stsgs/prompting | Prompt Studio |
| P-MAS-architector | Skills, standards | Zai-agent-toolkit | Governance |
| Flow-Studio-Pro | React Flow v12, Zustand | 3A Studio | Flow Editor (Screen 2) |
| MVP-Flow-Studio-Pro | EventBus, NodeExecutor, LLMProvider | 3A Studio | Flow Editor backend |
| prompting-v0.0 | 20 когнитивных формул, intent detection | @stsgs/prompting | Prompt Studio |
| Zai-agent-toolkit | 24 стандарта | 3A Studio /standards/ (read-only) | Качество кода |
| Zai-agent-toolkit | Agent templates | 3A Studio | Референс для промптов |
| Component-Browser | UI компоненты (~273) | @stsgs/ui | Wave 1-3 компонентов |

## Судьба проектов

| Проект | После создания 3A Studio |
|--------|--------------------------|
| 3A Studio | Главный активный проект |
| P-mas-studio | Источник -> Архив (оставить как исторический) |
| P-MAS-architector | Уже архив |
| Flow-Studio-Pro | Локальный исходник -> Архив |
| MVP-Flow-Studio-Pro | Локальный исходник -> Архив |
| prompting-v0.0 | Локальный исходник -> Архив |
| Zai-agent-toolkit | Отдельный активный репо (переработка) |
| Component-Browser | Исходник для @stsgs/ui -> Архив |
| StsDev-Wiki | Активный (база знаний) |
