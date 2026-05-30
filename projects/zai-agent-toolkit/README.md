# Zai-agent-toolkit [REFERENCE]

**Стандарты, навыки и правила для AI-разработки**

- **GitHub:** https://github.com/stsgs1980/Zai-agent-toolkit
- **Текущая версия:** v2.0.5 (259 файлов)
- **Статус:** Read-only reference, НЕ встраивается ни в какой проект

---

## Что это

Governance-репозиторий: стандарты, навыки (skills), шаблоны, инструкции для AI-агентов.
Это контекстная библиотека, НЕ агент — нет decision loop, нет оркестратора.

## Состав

| Компонент | Файлов | Содержание |
|-----------|--------|------------|
| skills/ | 35 | Навыки агентов |
| standards/ | 19 + 5 новых | Стандарты кода |
| instructions/ | 7 | Инструкции для AI |
| tools/ | 7 | Python-инструменты |
| dashboard/ | 20 .tsx + 10 API | Memory Dashboard |
| hooks/ | 3 | React хуки |
| templates/ | 14 | Шаблоны |

## Кто использует

| Кто | Что берёт | Как |
|-----|-----------|-----|
| 3A Studio | standards/ | Копирует read-only |
| 3A Studio | agents/templates/ | Референс для промптов |
| 3A Studio | dashboard паттерны | Только UI-паттерны, не код |

## Проблемы (из CROSS_TEST_REPORT)

46 багов, из них 4 критических:
1. 3 конкурирующих диагностических протокола
2. Пропущена директория навыка
3. Сиротский навык (без подключения)
4. Конфликт useState max 2 vs max 3

## Принцип

**Конфликты toolkit решаем в toolkit. Проекты используют toolkit как read-only reference.**

См. также: [decision: toolkit-placement](../3a-studio/decisions/toolkit-placement.md)
