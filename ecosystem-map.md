# Карта экосистемы

**Как все проекты связаны между собой**

> Дата: 2026-05-30 (обновлено)

---

## Экосистема

```
┌─────────────────┐  ┌──────────────┐  ┌──────────────────┐
│  P-mas-studio   │  │  3A Studio   │  │  Zai-agent-      │
│  [ACTIVE]       │  │  [NEW]       │  │  toolkit         │
│  1066 файлов    │  │  Greenfield  │  │  [REFERENCE]     │
│  105 коммитов   │  │              │  │  Read-only ref   │
└────────┬────────┘  └──────┬───────┘  └──────────────────┘
         │                  │
         │ кормит           │ берёт лучшее
         v                  v
┌─────────────────┐  ┌──────────────┐
│ @stsgs/ui       │  │ Flow-Studio- │
│ @stsgs/prompting│  │ Pro          │
│ @stsgs/shared   │  │ [LOCAL]      │
│ [PACKAGES]      │  └──────┬───────┘
└─────────────────┘         │
                            v
                    ┌──────────────┐
                    │ MVP-Flow-    │
                    │ Studio-Pro   │
                    │ [LOCAL]      │
                    └──────┬───────┘
                           │
         ┌─────────────────┼────────────────┐
         v                 v                 v
┌─────────────────┐ ┌──────────────┐ ┌──────────────┐
│ P-MAS-          │ │ prompting-   │ │ Component-   │
│ architector     │ │ v0.0         │ │ Browser      │
│ [ARCHIVED]      │ │ [ARCHIVED]   │ │ [LOCAL]      │
│ @stsgs/prompting│ │ 20 формул    │ │ для @stsgs/ui│
└─────────────────┘ └──────────────┘ └──────────────┘
```

## Статусы

| Статус | Значение | Кто |
|--------|----------|-----|
| **[ACTIVE]** | Рабочий код, активно развивается | P-mas-studio, StsDev-Wiki, Личный сайт |
| **[NEW]** | Greenfield, начало разработки | 3A Studio |
| **[REFERENCE]** | Read-only, не модифицируем | Zai-agent-toolkit |
| **[LOCAL]** | Локальный исходник, не на GitHub | Flow-Studio-Pro, MVP-Flow-Studio-Pro, Component-Browser |
| **[ARCHIVED]** | Мёртвый, не развивается | P-MAS-architector, prompting-v0.0 |
| **[PACKAGES]** | Переиспользуемые пакеты | @stsgs/ui, @stsgs/prompting, @stsgs/shared |

## Поток данных

| Из | Что | В | Для чего |
|----|-----|---|----------|
| P-mas-studio | Компоненты hierarchy, dashboard, prompt-studio | 3A Studio | Экраны 1, 4, 5, 7 |
| P-mas-studio | packages/ui (276 файлов) | @stsgs/ui | Дизайн-система |
| P-mas-studio | packages/cli, eslint-plugin | 3A Studio | Инструменты |
| P-mas-studio | API routes (19 штук) | 3A Studio | Backend |
| P-mas-studio | Prisma schema (7 моделей) | 3A Studio | Данные |
| P-MAS-architector | @stsgs/prompting (30+ файлов) | @stsgs/prompting | Prompt Studio |
| P-MAS-architector | Skills, standards | Zai-agent-toolkit | Governance |
| Flow-Studio-Pro | React Flow v12, Zustand | 3A Studio | Flow Editor |
| MVP-Flow-Studio-Pro | EventBus, NodeExecutor, LLMProvider | 3A Studio | Flow Editor backend |
| prompting-v0.0 | 20 когнитивных формул, intent detection | @stsgs/prompting | Prompt Studio |
| Zai-agent-toolkit | 24 стандарта | 3A Studio (read-only) | Качество кода |
| Zai-agent-toolkit | Agent templates | 3A Studio | Референс для промптов |
| Component-Browser | UI компоненты (~273) | @stsgs/ui | Wave 1-3 компонентов |

## Судьба проектов

| Проект | Перспектива |
|--------|-------------|
| P-mas-studio | Источник для 3A Studio → затем архив |
| 3A Studio | Новый проект, берёт лучшее из каждого |
| Zai-agent-toolkit | Отдельный репо, переработка |
| StsDev-Wiki | Активный, ядро памяти экосистемы |
| P-MAS-architector | Архив (уже) |
| Flow-Studio-Pro | Исходник → архив после переноса |
| MVP-Flow-Studio-Pro | Исходник → архив после переноса |
| prompting-v0.0 | Архив (уже) |
| Component-Browser | Исходник для @stsgs/ui → архив после переноса |
