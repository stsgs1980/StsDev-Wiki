# Стандарты

**Детальные стандарты кода для экосистемы**

> Источник: Zai-agent-toolkit (19+ стандартов). Здесь — конспект актуальных.

---

## Структура проекта

### S-01: Monorepo с пакетами

pnpm workspace. Пакеты: `@stsgs/ui`, `@stsgs/prompting`, `@stsgs/shared`, `eslint-plugin-3a`.
Зависимости однонаправленные: `shared` ← `ui`/`prompting` ← `app`.

### S-02: Feature-based структура

Каждый feature-модуль = отдельная папка с компонентами, хуками, типами.
Нет «god folders» с 50+ файлами.

## Код

### S-03: TypeScript strict

`strict: true` в tsconfig. Никаких `any` без явного обоснования.

### S-04: React компоненты

- Functional components only
- Props через interface/type, не inline
- Один компонент = один файл
- Экспорт по умолчанию для страниц, именованный для компонентов

### S-05: API routes

- Каждый роут = отдельная папка (`route.ts`)
- Валидация входных данных
- Обработка ошибок с HTTP-статусами

## Безопасность

### S-06: Auth guards

Все destructive операции (reset, seed, delete) — за `requireAdmin()`.
JWT верификация — с проверкой подписи, не просто `atob()`.

### S-07: Нет секретов в коде

API ключи, токены, креды — через env variables, не в исходниках.

## Тестирование

### S-08: Покрытие

Критические пути (auth, data operations) — с тестами.
Утилиты и хуки — с unit-тестами.
UI-компоненты — по возможности.

---

Полные стандарты: [Zai-agent-toolkit/standards/](https://github.com/stsgs1980/Zai-agent-toolkit) (19+ файлов)
