# 3A Studio — Карта прогресса

**Обновлено:** 2026-05-31
**Источник:** аудит репо (264 файла, 37 API routes, 125 тестов)

---

## Текущее состояние

Компоненты которые **уже работают** (не с нуля):

| Компонент | Файлов | Статус | Что есть |
|-----------|--------|--------|----------|
| Skill Forge | 6 | Работает | CRUD + экспорт SKILL.md |
| Standards Manager | 6 | Работает | CRUD + импорт .md |
| Flow Editor | 30 | Работает | Canvas, ноды, execute, Zustand store |
| Quality Analyzer | 10 | Работает | LLM-оценка, deep analysis |
| Agent Creator | 7 | Работает | 5-шаговый визард |
| Prompt Studio | есть | Работает | Prompt evaluation |
| Auth | 5 страниц | Работает | login/signup/reset/verify/forgot + JWT + middleware |
| Knowledge Base | есть | Работает | CRUD, TF-IDF search |
| Dashboard | есть | Работает | KPI, метрики, live data |
| i18n | 34 файла | Работает | EN/RU, 17 неймспейсов, интерполяция |
| Тесты | 15 файлов | Работает | 125 тестов (unit + integration) |

**Вывод:** Мастер-план описывает 8 фаз с нуля. Но Phase 0-1 и частично Phase 3-7 уже пройдены. Строим не с нуля — дорабатываем.

---

## Что нужно доделать (по приоритету)

### Приоритет P0 — без этого не работает

```
[P0-1] SQLite/PostgreSQL конфликт ........... DONE
       Prisma ORM абстрагирует SQL, прямого PostgreSQL-синтаксиса нет
       Проверено по requirements.md (AR-02)

[P0-2] Skill model → SkillFile .............. TODO
       Одно поле code → массив файлов
       Блокирует: экспорт папки навыка

[P0-3] Export Pipeline: папка навыка ......... TODO
       SKILL.md → skills/name/SKILL.md + scripts/ + references/
       Блокирует: связь 3A Studio → Zai-agent-toolkit
```

### Приоритет P1 — без этого не продакшен

```
[P1-1] Auth guards на reset/seed ............ DONE
       requireAdmin() добавлен, JWT верификация через jose
       НО: verifyJWT в middleware использует Web Crypto (корректно)
       Уязвимость: atob() в старой версии — исправлено

[P1-2] Тесты на каждую feature .............. PARTIAL
       Unit: 90 тестов (lib, validations, resilience)
       Integration: 35 тестов (auth chain, agent CRUD, cross-ref, crypto)
       Покрытие API routes: 3/37 (8%)
       ОТЛОЖЕНО: полное покрытие API routes до стабилизации архитектуры

[P1-3] Design tokens вместо hex .............. DONE
       Проверено: 1 не-брендовый хардкод (#30363D → кандидат на токен)
       Google-цвета в google-button.tsx — легитимны (бренд)

[P1-4] Git commit hygiene .................... TODO
       Убрать UUID-коммиты, вернуть осмысленные сообщения
```

### Приоритет P2 — без этого не агент

```
[P2-1] Flow Editor → Decision Loop .......... TODO
       Топологическая сортировка есть, цикла решений нет
       Блокирует: превращение тулкита в агента

[P2-2] zai deploy bridge .................... TODO
       3A Studio → Z.ai sandbox filesystem
       Блокирует: автодеплой навыков

[P2-3] Валидаторы стандартов ................ TODO
       Стандарты = текст. Должны стать исполняемыми проверками
```

---

## Отложено (explicitly deferred)

| Что | Почему | Когда вернуться |
|-----|--------|-----------------|
| Полное покрытие API routes тестами (34/37 без тестов) | Архитектура в flux, тесты будут постоянно ломаться | После стабилизации P0-2, P0-3 |
| E2E тесты (Playwright) | Проект активно меняется, E2E хрупкие | После Phase 3 |
| i18n: замена next-intl | Текущая контекстная система работает, next-intl — это Phase 8.2 master-plan | Phase 8 |
| Coverage reporting (v8) | @vitest/coverage-v8 не установлен | После стабилизации тестов |

---

## Каскад зависимостей

```
P0-2 (SkillFile модель)
  └──> P0-3 (Export Pipeline)
        └──> P2-2 (zai deploy)

P1-2 (Тесты) — PARTIAL, критичные пути покрыты
P1-4 (Commits) — независимо

P2-1 (Decision Loop) — зависит от стабильного P0
P2-3 (Валидаторы) — зависит от P0-2 (SkillFile)
```

---

## Сессия 2026-05-31

### Что делали
- Прочитана StsDev-Wiki (about, ecosystem-map, principles, rules, standards, decisions, session-protocol)
- Созданы интеграционные тесты: auth chain (8), cross-ref (17), API routes (10)
- Обновлён прогресс: P0-1 DONE, P1-1 DONE, P1-3 DONE
- Отметили что отложено: full API coverage, E2E, coverage reporting

### Что изменилось
- src/tests/integration/auth-chain.test.ts (8 tests)
- src/tests/integration/cross-ref.test.ts (17 tests)
- src/tests/integration/api-routes.test.ts (10 tests)
- StsDev-Wiki/projects/3a-studio/progress.md — обновлён

### Статус этапов
- P0-1: DONE
- P0-2: TODO
- P0-3: TODO
- P1-1: DONE
- P1-2: PARTIAL (критичные пути покрыты, полное покрытие отложено)
- P1-3: DONE
- P1-4: TODO
- P2-1: TODO
- P2-2: TODO
- P2-3: TODO

### Следующий шаг
- P0-2: SkillFile модель (добавить модель SkillFile в Prisma schema)
- P0-3: Export Pipeline (полный экспорт папки навыка)

---

## Формат обновления

Каждая сессия обновляет этот файл по шаблону:

```
## Сессия [дата]

### Что делали
- [конкретно]

### Что изменилось
- [файлы]

### Статус этапов
- P0-1: IN-PROGRESS / DONE / BLOCKED
- ...

### Следующий шаг
- [что делать дальше]
```

Это файл-истина. Если здесь TODO — значит не сделано, даже если кто-то говорит "готово".
