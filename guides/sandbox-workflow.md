# Стандарт работы в Z.ai песочнице

**Дата:** 2026-05-30 | **Версия:** 3.0
**Для кого:** любой AI-агент в новой сессии
**Статус:** универсальный стандарт (не привязан к конкретному проекту)

---

## Суть проблемы

Песочница Z.ai = **ephemeral контейнер**. Каждая новая сессия = чистая машина.
Ничего не сохраняется между сессиями. Всё что не запушено в GitHub — потеряно навсегда.

Поэтому песочница = **не хранилище, а рабочая поверхность**.
Хранилище = GitHub. Песочница = временная копия на пару часов.

---

## Полный цикл: от wiki до рабочего кода

После того как wiki прочитана (по [протоколу начала сессии](../session-protocol.md)), нужно определить что делаем и развернуть код в песочнице. Вот полный поток:

```
Wiki прочитана
    │
    ├── Что делаем?
    │       │
    │       ├── ПРОДОЛЖАЕМ СУЩЕСТВУЮЩИЙ ПРОЕКТ ──→ Стратегия A
    │       │
    │       ├── СОЗДАЁМ НОВЫЙ ПРОЕКТ ─────────────→ Стратегия B
    │       │
    │       └── ЧИТАЕМ / ИЗВЛЕКАЕМ КОД ──────────→ Стратегия C
    │
    └── Код в /home/z/my-project/
            │
            ├── dev.sh ──→ сервер на :3000 ──→ работаем
            │
            └── git push ──→ сохраняем результат
```

---

## Стратегия A: Продолжаем существующий проект

**Когда:** автор сказал «продолжаем проект X», или в wiki есть прогресс-файл с незавершённым этапом.

### Шаг 1: Клонировать wiki + рабочий проект + источники

```bash
# Wiki (всегда):
git clone https://github.com/stsgs1980/StsDev-Wiki.git /tmp/wiki

# Рабочий проект (куда пишем):
git clone --depth 1 https://github.com/stsgs1980/<PROJECT>.git /tmp/project

# Источники кода (по ecosystem-map.md — только те, что связаны с проектом):
git clone --depth 1 https://github.com/stsgs1980/<SOURCE>.git /tmp/<source-name>
```

> **Какие источники клонировать?** Смотри в ecosystem-map.md раздел «Поток данных» — какие репо.feedят в твой проект. Клонируй только их. Если unsure — спроси автора.

> **Если clone висит** (большой репо / медленная сеть):
> ```bash
> git clone --depth 1 --no-checkout <URL> /tmp/<name>
> cd /tmp/<name> && git checkout HEAD -- .
> ```

### Шаг 2: Развернуть рабочий проект в песочнице

```bash
# Очистить рабочую папку (ЗАЩИТИТЬ .zscripts/ и upload/!)
cd /home/z/my-project
ls -A | grep -v '^.zscripts$' | grep -v '^upload$' | xargs rm -rf

# Если есть root-owned директории:
sudo chown -R z:z /home/z/my-project/skills 2>/dev/null
rm -rf /home/z/my-project/skills 2>/dev/null

# Перенести файлы (КРИТИЧЕСКИ: rsync, НЕ cp -r — cp затрёт .zscripts/)
rsync -a --exclude='.zscripts/' --exclude='upload/' /tmp/project/ /home/z/my-project/

# Fallback если rsync нет:
cp -r /home/z/my-project/.zscripts/ /tmp/zscripts-backup/
cp -r /tmp/project/. /home/z/my-project/
rm -rf /home/z/my-project/.zscripts/
cp -r /tmp/zscripts-backup/ /home/z/my-project/.zscripts/
```

### Шаг 3: Git + dev-сервер

```bash
# Git ownership
git config --global --add safe.directory /home/z/my-project

# Аутентификация (PAT — единственный способ в песочнице)
git remote set-url origin https://<TOKEN>@github.com/stsgs1980/<PROJECT>.git

# Запуск dev-сервера (ЕДИНСТВЕННЫЙ правильный способ)
bash /home/z/my-project/.zscripts/dev.sh

# Проверка
curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/
# Ожидаем: 200
```

### Шаг 4: Читать контекст проекта

```bash
# Прогресс-файл (если есть — из wiki):
cat /tmp/wiki/projects/<project>/progress.md

# Worklog:
cat /home/z/my-project/worklog.md

# Последние коммиты:
cd /home/z/my-project && git log --oneline -10
```

### Шаг 5: Работать

Начинаем по протоколу 4D: Door → Do → Document → Double-check (см. [principles/construction-4d.md](../principles/construction-4d.md))

---

## Стратегия B: Создаём новый проект

**Когда:** автор сказал «создаём новый проект», или репозиторий пустой на GitHub.

### Шаг 1: Проверить — нет ли похожего ACTIVE проекта

По ecosystem-map.md: нет ли ACTIVE/NEW проекта с похожей функциональностью?
Если есть — можно ли расширить? Если нет — зафиксировать почему (это будет первый ADR).
См. [Протокол нового проекта](../new-project-protocol.md).

### Шаг 2: Клонировать wiki

```bash
git clone https://github.com/stsgs1980/StsDev-Wiki.git /tmp/wiki
```

### Шаг 3: Инициализация

**Вариант B1 — Init script (простой проект):**

```bash
curl https://z-cdn.chatglm.cn/fullstack/init-fullstack_1775040338514.sh | bash
```

Создаёт пустой Next.js 16 проект с shadcn/ui. Dev-сервер стартует автоматически.
Ограничение: минимальный одностраничный проект. Не подходит для сложных приложений.

**Вариант B2 — Ручная настройка (сложный проект):**

Работаем прямо в `/home/z/my-project/`. Песочница уже даёт `.zscripts/` и базовый scaffold.

Когда готовы сохранить на GitHub:

```bash
cd /home/z/my-project
git init
git config --global --add safe.directory /home/z/my-project
git remote add origin https://<TOKEN>@github.com/stsgs1980/<PROJECT>.git
git add -A
git commit -m "init: project setup"
git push -u origin main
```

### Шаг 4: Зарегистрировать в Wiki

После создания — обязательно добавить в wiki (по [new-project-protocol.md](../new-project-protocol.md)):
1. Добавить в ecosystem-map.md
2. Создать projects/\<name\>/README.md
3. Обновить SUMMARY.md
4. Запушить wiki

---

## Стратегия C: Чтение / извлечение кода

**Когда:** нужен контекст или куски кода из другого репо, dev-сервер не нужен.

```bash
# Shallow clone
git clone --depth 1 https://github.com/stsgs1980/<SOURCE>.git /tmp/<name>

# Sparse checkout (если нужен только пара файлов из огромного репо):
git clone --filter=blob:none --sparse <URL> /tmp/<name>
cd /tmp/<name> && git sparse-checkout set path/to/folder

# Копируем нужные файлы в рабочий проект
cp /tmp/<name>/path/to/file.tsx /home/z/my-project/src/components/
```

**Почему НЕ в `/home/z/my-project/`:** файлы чужого репо не являются частью рабочего проекта и могут сломать dev-сервер. Клонируем в `/tmp/`, читаем оттуда.

---

## Мины-замедлители

| # | Что | Что произойдёт | Как избежать |
|---|-----|---------------|-------------|
| 1 | `cp -r repo/. /home/z/my-project/` когда в репо есть `.zscripts/` | Sandbox `dev.sh` заменён репо-версией. Сервер не стартует. | `rsync --exclude='.zscripts/'` |
| 2 | `git init` без `safe.directory` | Git отказывается: "fatal: detected dubious ownership" | `git config --global --add safe.directory /home/z/my-project` |
| 3 | Root-owned директории (sandbox auto-creates) | `rm -rf` падает с Permission denied | `sudo chown -R z:z <dir>` перед удалением |
| 4 | `git clone` прямо в `/home/z/my-project/` | `fatal: destination already exists` | Клонировать в `/tmp/`, потом копировать |
| 5 | Забыл PAT для приватного репо | `Permission denied` на push/pull | `git remote set-url origin https://<TOKEN>@...` |

---

## Инфраструктура песочницы (.zscripts/)

Sandbox управляет dev-сервером через скрипты в `.zscripts/`:

| Скрипт | Назначение |
|--------|------------|
| `dev.sh` | Установка зависимостей + DB + dev-сервер + mini-services |
| `build.sh` | Production build |
| `start.sh` | Production startup (Caddy + built app) |
| `mini-services-*.sh` | Установка/запуск/watchdog для mini-services |
| `dev.log` | Логи dev-сервера |
| `dev.pid` | PID dev-сервера |

### Что делает dev.sh (по порядку)

```
1. bun install                        — установка зависимостей
2. bun run db:push                    — Prisma schema -> DB (если prisma/ есть)
3. bun run dev &                      — Next.js dev server на порту 3000
4. wait_for_service localhost:3000    — ждёт 200 OK
5. Health check (curl)
6. start_mini_services               — ws-service + watchdog
```

### CRITICAL: Никогда не запускай dev-сервер вручную

```bash
# Всё это НЕПРАВИЛЬНО в песочнице:
npm run dev          # НЕПРАВИЛЬНО — процесс умрёт
bun run dev          # НЕПРАВИЛЬНО — процесс умрёт
npx next dev         # НЕПРАВИЛЬНО — Turbopack крашится

# Единственный правильный способ:
bash /home/z/my-project/.zscripts/dev.sh
```

### Сложный проект (50+ файлов): Production mode

Если dev.sh стартует, но Turbopack падает:

```bash
cd /home/z/my-project
npx next build 2>&1 | tail -20
pkill -f 'next' 2>/dev/null; sleep 1
NODE_OPTIONS="--max-old-space-size=4096" npx next start -p 3000 -H 0.0.0.0 </dev/null >/tmp/zdev.log 2>&1 & disown
sleep 3
curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/
```

После каждого изменения кода нужен rebuild. Нет HMR, но стабильно.

---

## Аутентификация

Песочница **НЕ имеет** gh CLI, SSH-ключей, credential manager.
**SSH недоступен** (нет ssh binary, нет ssh-keygen, нет ~/.ssh/).

```bash
# Один раз в начале сессии:
git remote set-url origin https://<TOKEN>@github.com/<ORG>/<REPO>.git
# После этого работает обычный git push / git pull
```

**Безопасность:** PAT живёт только в текущей сессии. Не коммить `.git/config` с токеном.

---

## Завершение сессии

1. **Запушить ВСЕ изменения** (рабочий репо + wiki):
   ```bash
   cd /home/z/my-project && git add -A && git commit -m "feat/fix/refactor: описание" && git push
   cd /tmp/wiki && git add -A && git commit -m "..." && git push  # если менял
   ```

2. **Сообщить:** где остановился, что сделано, что дальше, какие файлы менял.

3. **Если push не работает** — немедленно сообщить. Без push = код потерян.

---

## Если сессия оборвалась

| Сценарий | Действие |
|----------|---------|
| Код был запушен | `git clone` wiki + рабочий репо, `git log --oneline -10`, продолжаем |
| Код НЕ был запушен | Потерян. Пересоздать по wiki + истории чата |
| Push не прошёл | Сообщить немедленно. Data loss. |

---

## Частые ошибки

| Ошибка | Причина | Решение |
|--------|---------|---------|
| `fatal: destination already exists` | Clone в непустую папку | Клонировать в `/tmp/`, потом rsync |
| `git push: Permission denied` | Нет PAT | `git remote set-url origin https://<TOKEN>@...` |
| `.zscripts/dev.sh` падает | Затёр sandbox `dev.sh` репо-версией | `git checkout -- .zscripts/` затем `bash .zscripts/dev.sh` |
| `Port 3000 already in use` | Порт занят | `pkill -f 'next dev'; sleep 1; bash .zscripts/dev.sh` |
| При clone удалил `.zscripts/` | `rm -rf` без фильтра | Всегда фильтруй: `grep -v '^.zscripts$' \| grep -v '^upload$'` |
| `fatal: detected dubious ownership` | Нет safe.directory | `git config --global --add safe.directory /home/z/my-project` |
| Dev-сервер умер при смене сессии | Shell process умер | `bash .zscripts/dev.sh` |
| Clone timeout | Большой репо | `--depth 1 --no-checkout` |

---

## Быстрая шпаргалка

```bash
# === Продолжить проект (полная последовательность) ===
git clone --depth 1 https://github.com/stsgs1980/<PROJECT>.git /tmp/project
cd /home/z/my-project && ls -A | grep -v '^.zscripts$' | grep -v '^upload$' | xargs rm -rf
rsync -a --exclude='.zscripts/' --exclude='upload/' /tmp/project/ /home/z/my-project/
git config --global --add safe.directory /home/z/my-project
git remote set-url origin https://<TOKEN>@github.com/stsgs1980/<PROJECT>.git
bash .zscripts/dev.sh

# === Проверка сервера ===
curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/

# === Перезапуск сервера ===
pkill -f 'next dev'; sleep 1; bash .zscripts/dev.sh

# === Push ===
git add -A && git commit -m "msg" && git push

# === Восстановление .zscripts/ ===
git checkout -- .zscripts/

# === Git lockup recovery ===
rm -rf .git/rebase-merge .git/rebase-apply
rm -f .git/MERGE_HEAD .git/MERGE_MSG .git/index.lock
git reset --hard HEAD

# === Production mode (для сложных проектов) ===
npx next build 2>&1 | tail -10
pkill -f 'next' 2>/dev/null; sleep 1
NODE_OPTIONS="--max-old-space-size=4096" npx next start -p 3000 -H 0.0.0.0 </dev/null >/tmp/zdev.log 2>&1 & disown
```
