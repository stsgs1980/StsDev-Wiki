---
Task ID: 4
Agent: main
Task: Create MemoryPlayground.tsx interactive component

Work Log:
- Read worklog.md and existing demo components (SummarizationDemo, RAGDemo, FactExtractionDemo, HierarchicalDemo) for patterns
- Created comprehensive MemoryPlayground.tsx with all requested features
- Fixed ESLint error: ref accessed during render (factIdRef.current in useMemo) → refactored to deterministic IDs based on messageId
- Verified ESLint passes clean (0 errors, 0 warnings)
- Verified dev server compiles successfully (GET / 200)

Component Features:
1. **Chat Interface** - Pre-populated with 3 sample messages, user can type and bot auto-responds after 1.2s delay with typing indicator
2. **Technique Selector** - 5 interactive buttons: Без управления, Суммаризация, Иерархическая, RAG, Извлечение фактов
3. **Live Processing Views**:
   - Без управления: Shows all messages accumulating, context bar turns red, warning messages at 60%/80%
   - Суммаризация: When messages > 5, shows compressed summary + recent messages with token savings
   - Иерархическая: Two-panel split (long-term/short-term memory) with token equation display
   - RAG: Vector embedding visualization with search highlighting and relevance scores
   - Извлечение фактов: Growing user profile card with JSON-style display and source annotations
4. **Context Window Visual** - Horizontal bar (green → yellow → red) with percentage labels
5. **Token Counter** - Using Math.ceil(text.split(/\s+/).length * 1.3) formula
6. **Cost Display** - Estimated GPT-4 cost ($10/1M input tokens)
7. **Stats Dashboard** - 4-stat grid: tokens, cost, messages, savings percentage

File created:
- /src/components/memory-demo/MemoryPlayground.tsx (~600 lines)
