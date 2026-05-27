# Стратегия синтеза (как переносим код из существующих репо)

**Дата:** 2026-05-28
**Статус:** принято

---

## Суть

Мы НЕ копируем файлы как есть и НЕ чистим исходные репо заранее.
Мы **извлекаем нужное в момент необходимости** и сразу разбиваем по anti-monolith.

## Почему

1. Из исходных репо мы берём **не всё** -- большое количество кода мёртвое или не нужно
2. Очищать "впрок" = тратить контекст на то что может не понадобиться
3. Anti-monolith проверки в момент переноса гарантируют чистоту

## Что НЕ берём вообще

| Файл/папка | Репо | Почему |
|------------|------|--------|
| `agent-hierarchy.tsx` | P-mas-studio | 3,455 строк мёртвого кода |
| `layout/features/` | P-mas-studio | Мёртвый код |
| `layout/app-shell.tsx` | P-mas-studio | Мёртвый код |
| `layout/sections/` | P-mas-studio | Дубликаты |
| `docs-pmas/` | P-mas-studio | Дубликаты wireframe |
| Дубликаты утилит (hexToRgb x4, SectionLabel x4) | P-mas-studio | Уже есть в @stsgs/shared |

## Процесс переноса (для каждой фазы)

```
1. Определить что нужно для текущей фазы
2. git clone --depth 1 <source-repo> /tmp/source  (shallow, только чтение)
3. Найти нужные файлы в /tmp/source/
4. Переписать/разбить файлы по anti-monolith правилам:
   - Файл <= 150 строк
   - Компонент <= 3 useState
   - Нет cross-layer импортов
   - Нет unicode escapes
5. Внести в 3A Studio (правильная папка/пакет)
6. Проверить: bun run lint + bun run type-check
7. Закоммитить и запушить
```

## Карта: откуда берём по фазам

| Фаза | Что берём | Откуда | Anti-monolith риск |
|------|-----------|--------|-------------------|
| Phase 0 | Типы, prompting, eslint | Написано с нуля (стабы) | Низкий (2 файла 200 строк) |
| Phase 1 | Root layout, sidebar | P-mas-studio/src/app/layout.tsx | Низкий |
| Phase 2 | (очистка -- удаляем, не переносим) | -- | -- |
| Phase 3 | Flow Editor (Zustand store, NodeExecutor, EventBus, 18 node types) | MVP-Flow-Studio-Pro/src/lib/flow/ + Flow-Studio-Pro/src/components/flow/ | **Высокий** -- NodeFactory, FlowEditor, CustomNodes |
| Phase 4 | Dashboard (KPI strip, charts, heatmap, timeline) | P-mas-studio/src/components/dashboard/ (20 файлов) | **Высокий** -- architecture-diagram.tsx, formula-flow-diagram.tsx |
| Phase 5 | Agent CRUD, hierarchy graph | P-mas-studio/src/components/hierarchy/ (24 файла) | **Средний** -- agent-hierarchy-v2.tsx |
| Phase 6 | Knowledge Base UI | Toolkit паттерны (MemoryBrowser.tsx 414 строк) | **Средний** |
| Phase 7A | Template Gallery | MVP-Flow-Studio-Pro/src/components/flow/TemplateGallery.tsx | Низкий |
| Phase 7C | Skill Forge | P-mas-studio/agents/ + toolkit patterns | Низкий |

## Anti-monolith правила

| Правило | Лимит | Проверка |
|---------|-------|----------|
| Макс строк в файле | 150 | `eslint-plugin-3a/max-lines` |
| Макс useState в компоненте | 3 | `eslint-plugin-3a/max-use-state` |
| Cross-layer импорты | 0 | `eslint-plugin-3a/no-cross-layer` |
| Unicode escapes | 0 | `eslint-plugin-3a/no-unicode-escapes` |

Если исходный файл превышает лимит -- **сплитим**, не тянем целиком.

## Исходные репо (клонировать при необходимости)

```bash
# Только чтение, shallow clone
git clone --depth 1 https://github.com/stsgs1980/P-mas-studio.git /tmp/p-mas-studio
git clone --depth 1 https://github.com/stsgs1980/3a-studio.git /tmp/3a-studio
# Zai-agent-toolkit -- только стандарты
git clone --depth 1 https://github.com/stsgs1980/Zai-agent-toolkit.git /tmp/toolkit
```
