# 3A Studio — Все экраны

**Обновлено:** 2026-06-01
**Источник:** аудит AAA-studio (209+ коммитов) + 3a-studio-mas (45K LOC)

---

## Текущий статус

| # | Экран | Путь | Статус | Источник |
|---|-------|------|--------|----------|
| 1 | **Dashboard** | /dashboard | Работает | KPI, sparklines, heatmap, timeline, live from DB |
| 2 | **Flow Editor** | /editor | Работает | 18 node types, ReactFlow, live execution |
| 3 | **Templates** | /templates | Работает | 6 flow templates + prompt library |
| 4 | **Agents** | /agents | Работает | CRUD, executions, EntityPicker |
| 5 | **Hierarchy** | /hierarchy | Работает | Visual parent/child graph, 6 edge types |
| 6 | **Pipelines** | /pipelines | Работает | Real flow execution, node-level drill-down |
| 7 | **Prompt Studio** | /prompt-studio | Работает | Write + Formulas + Frameworks + Compare + Intent |
| 8 | **Knowledge Base** | /knowledge | Работает | Upload, TF-IDF search |
| 9 | **Skill Forge** | /skills-page | Работает | CRUD, code/tests, SKILL.md export |
| 10 | **Standards Manager** | /standards | Работает | CRUD, rules editor, cross-ref validation |
| 11 | **Audit Log** | /audit | Работает | JSON-highlighted, filter by entity |
| 12 | **Settings** | /settings | Работает | Multi-provider LLM, theme, key masking |
| 13 | **Approvals** | /approvals | Работает | HITL approval panel, escalation |
| 14 | **Testing** | /testing | Работает | Test runner, judge scoring |
| 15 | **Cost Monitor** | /cost | Работает | Token/cost tracking |
| 16 | **Self-Correction** | /self-correction | Работает | Auto-revision loop |
| 17 | **Analysis** | /analysis | Работает | Multi-agent analysis sessions |
| 18 | **Comparison** | /comparison | Работает | Agent diff, version diff, regression |
| 19 | **Wiki** | /wiki | Работает | 14 статей, Ctrl+K drawer |

Дополнительно: Landing page (/), Auth (login/signup/verify/reset/forgot)

## Wireframes (исторические)

9 HTML wireframes в P-mas-studio/wireframes/:
01-dashboard, 02-hierarchy, 03-workflows, 04-prompt-studio, 05-unified-studio, 06-task-management, 07-formula-explorer, 08-agent-detail, 09-login

## История

- Первоначальная спецификация: 12 экранов (FLOW_STUDIO_PRO_SPECIFICATION.md v1.0)
- После аудита 2026-05-31: 19 экранов (все реализованы в AAA-studio)
- Канонический источник: 3a-studio-mas (45K LOC, полный проект)
