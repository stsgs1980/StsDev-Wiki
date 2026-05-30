# Decision: Название 3A Studio

**Дата:** 2026-05-27
**Статус:** Принято

---

## Контекст

Проект развивался под несколькими названиями: P-MAS, P-MAS-architector, Flow Studio Pro. Нужно единое имя для нового greenfield проекта, который синтезирует всё накопленное.

## Рассмотренные варианты

| Вариант | Плюсы | Минусы |
|---------|-------|--------|
| Flow Studio Pro | Уже есть спецификация (12 экранов) | Не отражает AI/agent суть |
| P-MAS v2 | Узнаваемое | P-MAS = "Prompt Multi-Agent System", слишком длинное, "P" непонятно |
| 3A Studio | Artificial + Agentic + Architecture, короткое, memorable | Нужно объяснять расшифровку |

## Решение

**3A Studio** (Artificial. Agentic. Architecture.)

- Домен: 3a-studio.dev / 3a.studio
- Репозиторий: stsgs1980/3a-studio
- Пакеты: @stsgs/ui, @stsgs/prompting, @stsgs/shared

## Почему

1. Отражает суть: AI (Artificial) + агенты (Agentic) + структура (Architecture)
2. Короткое и memorable
3. Не привязано к конкретной технологии (React Flow, Prisma и т.д.)
4. Звучит профессионально для dev-инструмента

## От чего отказались

- Flow Studio Pro -- слишком узкое (только "flow")
- P-MAS -- устаревшее, непонятное для новых пользователей
