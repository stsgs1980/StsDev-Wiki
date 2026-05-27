# Zai-agent-toolkit

**Стандарты, навыки и правила для AI-разработки**

- **GitHub:** https://github.com/stsgs1980/Zai-agent-toolkit (ожидает создания/ренейма)
- **Текущая версия:** v2.0.5 (архив в P-mas-studio)
- **Статус:** Конфликтный, требует переработки
- **Отношение к 3A Studio:** Read-only reference, НЕ встраивается

---

## Что это

Governance-репозиторий: стандарты, навыки (skills), шаблоны, инструкции для AI-агентов.

## Что полезно для 3A Studio

| Компонент | Файлов | Использование |
|-----------|--------|---------------|
| standards/ | 19 + 5 новых | Копируем read-only в 3A Studio/standards/ |
| agents/templates/ | 3 шаблона | Референс для промптов агентов |
| dashboard-integration/ | 31 файл, 3,419 строк | ТОЛЬКО паттерны UI, не код (зависит от Python + ChromaDB) |

## Проблемы (из CROSS_TEST_REPORT)

46 багов, из них 4 критических:
1. 3 конкурирующих диагностических протокола
2. Пропущена директория навыка
3. Сиротский навык (без подключения)
4. Конфликт useState max 2 vs max 3

## Принцип

**Конфликты toolkit решаем в toolkit. 3A Studio использует toolkit как read-only reference, не встраивает его.**

См. также: [decision: toolkit-placement](../decisions/toolkit-placement.md)
