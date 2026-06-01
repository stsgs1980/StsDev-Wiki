# prompting-v0.0

**Pure TypeScript prompting library — @stsgs/prompting v0.1.0**

- **Статус:** [PACKAGE]
- **GitHub:** https://github.com/stsgs1980/prompting-v0.0
- **LOC:** 4,304
- **NPM:** @stsgs/prompting v0.1.0
- **Стек:** TypeScript, npm (zero runtime deps)
- **Происхождение:** Извлечён из UI-Kit монорепо (`src/lib/prompting/`)

---

## Что содержит (4,304 LOC)

### Core (оценка + типы)
- `core/types.ts` (1,149 LOC) — domain model: PromptScore, Technique, Framework, AgentTemplate, OrchestrationPattern
- `core/techniques.ts` (417 LOC) — 20 technique definitions (Chain-of-Thought, Tree-of-Thought, ReAct, Reflexion, etc.)
- `core/frameworks.ts` (254 LOC) — 11 frameworks + builder (RTF, TAG, CARE, RISE, SOAP, STAR, AIDA, etc.)
- `core/system-prompt.ts` — system prompt builder

### Templates (шаблоны + интенты)
- `templates/flow-templates.ts` — flow definitions для orchestration
- `templates/intent-templates.ts` (266 LOC) — 12 intents + classifier
- `templates/agent-templates.ts` (237 LOC) — 12 agent presets (Researcher, Coder, Reviewer, etc.)

### Evaluation (оценка + бенчмарки)
- `evaluation/scoring.ts` — 6-dimension scoring engine (clarity, specificity, structure, actionability, context, creativity), оценки S/A/B/C/D/F
- `evaluation/benchmark.ts` (427 LOC) — 40-check quality audit
- `evaluation/blind-compare.ts` (121 LOC) — blind comparison algorithm

### Agents (когнитивные формулы + resilience)
- `agents/cognitive-formulas.ts` (301 LOC) — 20 reasoning patterns (CoT, ToT, GoT, CoVe, ReAct, Reflexion, ReWOO, MoA, etc.)
- `agents/orchestration.ts` — 12 orchestration patterns
- `agents/resilience.ts` (400 LOC) — retry, circuit breaker, timeout, bulkhead

### Instructions Registry
- `instructions.ts` (559 LOC) — instruction content registry

## Что даёт 3A Studio

| Приоритет | Что | Для чего |
|-----------|-----|----------|
| P0 | Core types + scoring + orchestration patterns | Domain model для Prompt Studio |
| P1 | Techniques + frameworks + intent matching + cognitive formulas | Prompt Studio расширение |
| P1 | Benchmark engine + resilience utilities | Quality assurance + reliability |
| P2 | Blind compare + instructions registry | Дополнительный функционал |

## Ключевое отличие от 3a-studio-mas/src/lib/prompting/

В 3a-studio-mas `src/lib/prompting/` содержит **заглушки**:
- `evaluation/scoring.ts` — возвращает `Math.floor(Math.random() * 40) + 60` (mock)
- `core/techniques.ts` — только 2 техники вместо 20

prompting-v0.0 — это **полноценная** библиотека с реальными эвристиками. Всегда использовать prompting-v0.0 или `packages/prompting/` из 3a-studio-mas, но НЕ `src/lib/prompting/`.

## Связанные проекты

- [3A Studio](../3a-studio/README.md) — основной потребитель
- [P-MAS-architector](../p-mas-architector/README.md) — использует @stsgs/prompting для когнитивных формул
- [UI-Kit](../ui-kit/README.md) — исходный монорепо (prompting-v0.0 был извлечён из него)
