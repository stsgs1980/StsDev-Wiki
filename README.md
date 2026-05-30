# База знаний — Станислав Граур

> Личная база знаний экосистемы из 54 репозиториев. Принципы, решения, карта связей, документация.

## Ядро (устав)

Это первое что читает любая новая AI-сессия:

| Файл | Суть |
|------|------|
| [about.md](about.md) | Кто автор, стек, подход |
| [ecosystem-map.md](ecosystem-map.md) | Все 54 проекта + связи + статусы |
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
| [Проекты](projects/index.md) | Все 54 проекта по группам |
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

## Структура

```
StsDev-Wiki/
├── SUMMARY.md                ← навигация для GitBook
├── README.md                 ← эта страница
├── about.md                  ← об авторе
├── ecosystem-map.md          ← карта экосистемы (главная)
├── rules.md                  ← 8 обязательных правил
├── standards.md              ← стандарты кода
├── session-protocol.md       ← протокол начала сессии
├── new-project-protocol.md   ← протокол нового проекта
├── principles/               ← вечные правила
├── decisions/                ← кросс-проектные ADRы
├── packages/                 ← переиспользуемые пакеты
├── projects/                 ← все проекты по группам
│   ├── _archived/            ← мёртвые проекты
│   ├── 3a-studio/            ← [NEW] включая decisions/
│   ├── p-mas-studio/         ← [ACTIVE]
│   └── ...
├── agents/                   ← кто работает
├── guides/                   ← инструкции
└── references/               ← внешние материалы
```
