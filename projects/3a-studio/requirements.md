# 3A Studio — Специфические требования

**Проект:** 3A Studio (Artificial. Agentic. Architecture.)
**Репо:** https://github.com/stsgs1980/3a-studio
**Основано на:** аудите кода 2026-05-30 (264 исходных файла, 32 API route)

---

## Архитектурные требования

### AR-01: Monorepo с пакетами
3A Studio = pnpm workspace monorepo. Четыре пакета:
- `@stsgs/ui` — дизайн-система
- `@stsgs/prompting` — библиотека оценок промптов
- `@stsgs/shared` — типы, утилиты, константы
- `eslint-plugin-3a` — кастомные правила

Зависимости между пакетами однонаправленные: `shared` ← `ui` / `prompting` ← `app`. Обратных зависимостей нет.

### AR-02: SQLite для разработки, PostgreSQL для продакшена
Prisma schema использует `provider = "sqlite"` с путём `file:/home/z/my-project/db/custom.db`. Код не должен использовать PostgreSQL-специфичный синтаксис (`$1`, `NOW()`, `ON CONFLICT`) пока не переключён provider.

**Известная проблема:** `src/lib/llm/settings.ts` использует PostgreSQL-синтаксис при SQLite-provider. Должно быть исправлено.

### AR-03: Anti-monolith правила
| Правило | Лимит | Проверка |
|---------|-------|----------|
| Макс строк в файле | 150 | `eslint-plugin-3a/max-lines` |
| Макс useState в компоненте | 3 | `eslint-plugin-3a/max-use-state` |
| Cross-layer импорты | 0 | `eslint-plugin-3a/no-cross-layer` |

Файл превышает лимит — сплитим, не тянем целиком.

---

## Требования к данным

### DR-01: Skill model — многофайловая структура
Текущая модель `Skill` имеет одно поле `code: String`. Реальные навыки содержат несколько файлов (SKILL.md + скрипты + шаблоны + референсы). Нужно добавить модель `SkillFile` с привязкой к `Skill`.

```
Skill 1:N SkillFile
  - SKILL.md     (главный файл)
  - scripts/*.py / *.sh  (исполняемые)
  - templates/*  (шаблоны)
  - references/* (справочные материалы)
```

**Статус:** не реализовано. Критично для Export Pipeline.

### DR-02: Экспорт из базы в файловую систему
API route `GET /api/skills/[id]/export` уже генерирует SKILL.md из записи в базе. Нужно расширить до генерации полной структуры папки навыка:
- `skills/name/SKILL.md`
- `skills/name/scripts/...`
- `skills/name/templates/...`
- `skills/name/references/...`

**Статус:** частично. Экспорт одного файла работает, экспорт папки — нет.

### DR-03: Импорт стандартов из .md
API route `POST /api/standards/import` уже принимает .md файл и парсит его в Standard-запись.

**Статус:** работает.

---

## Требования к качеству

### QR-01: Тесты
Минимальный набор тестов существует: 5 файлов, 38 тестов (db, auth, crypto, LLM types, middleware). Каждый новый API route и каждая новая feature должны сопровождаться тестами.

**Порог:** не менее 1 тест-файла на feature.

### QR-02: Build должен проходить
`next build` и `tsc --noEmit` должны проходить без ошибок перед каждым коммитом в main.

### QR-03: Нет хардкода цветов
20+ мест используют hex-коды напрямую (`#8B5CF6`, `#06B6D4` и т.д.) вместо design tokens. Новые компоненты должны использовать токены из `@stsgs/ui`.

---

## Требования к безопасности

### SR-01: Auth guards
`POST /api/dashboard/reset` и `POST /api/dashboard/seed` доступны без аутентификации. В продакшене должны быть защищены.

### SR-02: Дефолтные креды
Seed-скрипт создаёт admin/admin. Для продакшена — обязательная смена при первом входе.

---

## Требования к UI

### UI-01: 12 экранов
Полный набор экранов описан в `architecture/3a-studio-screens.md`. Текущий статус:
- Работают: Dashboard, Agents, Hierarchy, Flow Editor, Prompt Studio, Quality Analyzer, Skills, Standards, Knowledge, Settings
- Частично: Templates, Pipelines, Audit, Wiki

### UI-02: Design tokens
Все цвета, отступы, размеры — через токены. Не через hex напрямую.

### UI-03: Язык интерфейса — English
UI тексты, кнопки, лейблы — на английском. Русский — только в Wiki и чатах. См. `decisions/language-strategy.md`.

---

## Коммит-паттерн

Текущий паттерн в репо: 58% fix, 22% feat, 20% мусор (UUID вместо сообщений). Целевой паттерн:

| Тип | Доля | Описание |
|-----|------|----------|
| feat | 50%+ | Новая функциональность |
| fix | <30% | Исправления |
| refactor | 10-15% | Реструктуризация |
| chore/docs | 5-10% | Обслуживание |

Если fix > 50% — мы тушим пожары, не строим. Это сигнал к остановке и анализу.
