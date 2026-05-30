# Правила

**Обязательные правила для всех проектов экосистемы**

---

## R-01: Не читал — не утверждаешь

Любое утверждение о коде, файлах или структуре проекта должно быть основано на реальном чтении файлов в текущей сессии. Память прошлых сессий = гипотеза, не факт.

## R-02: Анти-монолит

- Файл ≤ 150 строк (проверяется `eslint-plugin-3a/max-lines`)
- useState ≤ 3 в компоненте (проверяется `eslint-plugin-3a/max-use-state`)
- Нет cross-layer импортов (проверяется `eslint-plugin-3a/no-cross-layer`)
- Нет unicode escapes (проверяется `eslint-plugin-3a/no-unicode-escapes`)

## R-03: Коммит — осмысленный

Коммит без описания или с UUID вместо сообщения = мусор. Правило: коммит без осмысленного сообщения = не принимается.

## R-04: Build должен проходить

`next build` и `tsc --noEmit` — без ошибок перед коммитом в main.

## R-05: Хардкод цветов — через токены

Новый код — через design tokens (@stsgs/ui), не через hex. Брендовые цвета (Google, etc.) — исключение.

## R-06: Язык

- Код, UI, коммиты, README = English
- Wiki, обсуждения = Русский
- См. [decision: language-strategy](decisions/language-strategy.md)

## R-07: Конфликты toolkit решаем в toolkit

Zai-agent-toolkit = read-only reference. Проекты используют его как источник стандартов, не встраивают.

## R-08: Пакеты — однонаправленные зависимости

```
app → @stsgs/ui → @stsgs/shared
app → @stsgs/prompting → @stsgs/shared
eslint-plugin-3a → (standalone)
```

Обратных зависимостей нет. Shared = фундамент.

---

См. также:
- [Принципы](principles/anti-hallucination.md) — почему эти правила существуют
- [Стандарты](standards.md) — детальные стандарты кода
- [Протоколы](protocols.md) — что делать при старте
