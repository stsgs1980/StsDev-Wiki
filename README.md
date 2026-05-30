# База знаний — Станислав Граур

> Личная база знаний экосистемы из 54 репозиториев. Принципы, решения, карта связей, документация.
> Данные основаны на реальных README и package.json из GitHub (2026-05-30).

## Ядро (устав)

Это первое что читает любая новая AI-сессия:

| Файл | Суть |
|------|------|
| [about.md](about.md) | Кто автор, стек, подход |
| [ecosystem-map.md](ecosystem-map.md) | Все 54 проекта + связи + статусы (из реальных README) |
| [rules.md](rules.md) | 8 обязательных правил |
| [standards.md](standards.md) | Стандарты кода |
| [session-protocol.md](session-protocol.md) | Что делать при начале сессии |
| [new-project-protocol.md](new-project-protocol.md) | Что делать при создании нового проекта |

## Разделы

| Раздел | Что внутри |
|--------|-----------|
| [Принципы](principles/anti-hallucination.md) | Вечные правила для всех проектов |
| [Решения](decisions/language-strategy.md) | Кросс-проектные ADRы |
| [Пакеты](packages/ui.md) | Переиспользуемые пакеты (@stsgs/ui, @stsgs/prompting, @stsgs/shared) |
| [Проекты](ecosystem-map.md) | Все 54 проекта по группам и статусам |
| [Агенты](agents/index.md) | Кто работает, ограничения |
| [Гайды](guides/index.md) | Инструкции и best practices |
| [Референсы](references/index.md) | Внешние материалы |

## Как пользоваться

1. Редактируешь любой `.md` файл
2. Запускаешь `push.bat` — всё улетает в GitHub и GitBook

Если создаёшь **новый** файл — пропиши его в `SUMMARY.md`. Если файла нет в `SUMMARY.md` — GitBook его не увидит.

## Статусы проектов

| Статус | Значение |
|--------|----------|
| [ACTIVE] | Рабочий код, активно развивается |
| [NEW] | Greenfield, начало разработки |
| [REFERENCE] | Read-only, не модифицируем |
| [LOCAL] | Локальный исходник |
| [ARCHIVED] | Мёртвый, не развивается |
| [PACKAGE] | Переиспользуемый пакет |
| [EMPTY] | Пустой репозиторий |

## Структура

```
StsDev-Wiki/
├── SUMMARY.md                ← навигация для GitBook
├── README.md                 ← эта страница
├── about.md                  ← об авторе
├── ecosystem-map.md          ← карта экосистемы (из реальных README)
├── rules.md                  ← 8 обязательных правил
├── standards.md              ← стандарты кода
├── session-protocol.md       ← протокол начала сессии
├── new-project-protocol.md   ← протокол нового проекта
├── principles/               ← вечные правила
├── decisions/                ← кросс-проектные ADRы
├── packages/                 ← переиспользуемые пакеты
├── projects/                 ← детальная документация проектов
│   ├── _archived/            ← мёртвые проекты
│   ├── p-mas-architector/    ← [ACTIVE] 942 файла, 164 коммита
│   ├── 3a-studio/            ← [ACTIVE] 143 коммита, 12 экранов
│   ├── component-browser/    ← [ACTIVE] 213 компонентов
│   ├── flow-studio-pro/      ← [ACTIVE] 18 node types
│   ├── zai-agent-toolkit/    ← [REFERENCE]
│   └── personal-site/        ← [ACTIVE] приватный
├── agents/                   ← кто работает
├── guides/                   ← инструкции
└── references/               ← внешние материалы
```

## Общий стек (паттерн)

Подавляющее большинство проектов используют **Z.ai Code Scaffold**:

| Слой | Технология |
|------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 |
| UI Library | shadcn/ui (Radix UI) |
| ORM | Prisma (SQLite / PostgreSQL) |
| State | Zustand |
| Animations | Framer Motion 12 |
| AI | z-ai-web-dev-sdk |
| Runtime | Bun |
