# verify-docs в StsDev-Wiki

**verify-docs** интегрирован в wiki как инструмент автоматической проверки консистентности документации. Реализует принцип [Верификация](../principles/verification.md) на практике — числа в документации сверяются с реальным состоянием файловой системы.

---

## Что проверяет

| Проверка | Что делает | Тип |
|----------|-----------|-----|
| **Active projects** | Количество README.md в `projects/*/` | glob |
| **All project READMEs** | Счётчик проектов через custom plugin | custom:project-readmes |
| **Principles** | Количество .md в `principles/` | glob |
| **Guides** | Количество .md в `guides/` | glob |
| **References** | Количество .md в `references/` | glob |
| **Packages docs** | Количество .md в `packages/` | glob |
| **Agents docs** | Количество .md в `agents/` | glob |
| **SUMMARY.md links** | Количество ссылок в SUMMARY.md | custom:summary-links |
| **Dead links in SUMMARY** | Количество битых ссылок | custom:summary-dead-links |
| **Total .md files** | Все .md файлы в wiki | glob |
| **Git commits** | Количество коммитов | git:HEAD |

---

## Файлы конфигурации

```
StsDev-Wiki/
  verify-docs.json            # конфигурация проверок
  verify-docs.plugins.ts      # custom source resolvers (wiki-specific)
  tools/verify-docs/          # исходный код verify-docs
    src/
      engine.ts                # ядро движка
      cli.ts                   # CLI
      init.ts                  # quick setup
    templates/
      pre-push                 # git hook template
      verify.yml               # GitHub Actions template
    package.json
    README.md                  # полная документация verify-docs
```

---

## Использование

### Запустить проверку вручную

```bash
cd StsDev-Wiki
bun run tools/verify-docs/src/cli.ts
```

### Автоматическая проверка при push

pre-push hook установлен в `.git/hooks/pre-push`. Каждый `git push` автоматически запускает verify-docs. Если найдены несоответствия — push блокируется.

Обход: `git push --no-verify`

### CI (GitHub Actions)

```yaml
- name: Verify wiki docs
  run: bun run tools/verify-docs/src/cli.ts --ci
```

---

## Custom плагины

`verify-docs.plugins.ts` определяет wiki-specific источники:

- **custom:project-readmes** — считает директории с README.md в `projects/`
- **custom:summary-links** — считает все markdown-ссылки в SUMMARY.md
- **custom:summary-dead-links** — считает ссылки, указывающие на несуществующие файлы
- **custom:wiki-sections** — считает ##-заголовки в SUMMARY.md

---

## Связь с принципами

verify-docs — практическая реализация принципа [Верификация](../principles/verification.md). Вместо «документация выглядит правильно» — автоматическая сверка чисел с реальностью.
