# MVP-Flow-Studio-Pro

**Архивный проект — backend Flow Editor**

- **Статус:** [ARCHIVED]
- **GitHub:** https://github.com/stsgs1980/MVP-Flow-Studio-Pro
- **Судьба:** Исходник для Phase 3 → архив после переноса

---

## Что содержит

- EventBus.ts (108 строк) — pub/sub для node execution
- NodeExecutor.ts (225 строк) — топологическая сортировка
- LLMProvider.ts (121 строк) — абстракция над z-ai-web-dev-sdk
- NodeFactory.ts (134 строк) — создание нод с дефолтными данными
- FlowEditor.tsx (359 строк) — **нужен сплит на 3 файла**
- CustomNodes.tsx (231 строк) — **нужен сплит по категориям**
- TemplateGallery.tsx
- VersionHistory

## Что даёт 3A Studio

Flow Editor backend (Phase 3) — критичный исходник.

## См. также

- [Flow-Studio-Pro](../../flow-studio-pro/README.md) — UI-часть Flow Editor
- [3A Studio Master Plan](../../3a-studio/master-plan.md) — Phase 3
