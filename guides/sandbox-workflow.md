# Стандарт работы в Z.ai песочнице

**Дата:** 2026-05-27 | **Обновлено:** 2026-05-29 (v2.1 -- bug audit)
**Для кого:** stsgs1980 и любой AI-агент в новой сессии
**Статус:** универсальный стандарт (не привязан к конкретному проекту)
**Канонический документ:** `ZAI_SANDBOX_GUIDE.md` -- единый верифицированный гайд (есть в download/ и в этом репо)

---

## Суть проблемы

Песочница Z.ai = **ephemeral контейнер**. Каждая новая сессия = чистая машина.
Ничего не сохраняется между сессиями. Всё что не запушено в GitHub -- потеряно навсегда.

Поэтому песочница = **не хранилище, а рабочая поверхность**.
Хранилище = GitHub. Песочница = временная копия на пару часов.

---

## Базовые ограничения

| Правило | Почему |
|---------|--------|
| Рабочая папка = **ТОЛЬКО** `/home/z/my-project/` | Dev-сервер песочницы жёстко привязан к этому пути |
| `.zscripts/` внутри `/home/z/my-project/` = инфраструктура песочницы | **НЕ удалять**, **НЕ перезаписывать** |
| `upload/` = sandbox mount point | **Нельзя удалить** (Device or resource busy) |
| `download/` = регулярная директория | НЕ mount point, удалится при перезагрузке проекта |
| Git push = единственный способ сохранить результат | Нет долговременного диска |
| Песочница **НЕ имеет** gh CLI, SSH-ключей, credential manager | Для push/pull нужен PAT в HTTPS URL |
| SSH = **НЕ доступен** (нет ssh binary, нет ssh-keygen) | Единственный способ -- PAT через URL |
| Сессия может оборваться в любой момент | Коммити часто |
| npm/bun/node/python = есть | Основной стек доступен |

---

## Мины-замедлители (сломают сессию)

| # | Что | Что произойдёт | Как избежать |
|---|-----|---------------|-------------|
| 1 | `cp -r repo/. /home/z/my-project/` когда в репо есть `.zscripts/` | Sandbox `dev.sh` заменён репо-версией. Сервер не стартует. | `rsync --exclude='.zscripts/'` (см. Стратегия 1, Шаг 3) |
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
1. bun install                        -- установка зависимостей
2. bun run db:push                    -- Prisma schema -> DB (если prisma/ есть)
3. bun run dev &                      -- Next.js dev server на порту 3000
4. wait_for_service localhost:3000    -- ждёт 200 OK
5. Health check (curl)
6. start_mini_services               -- ws-service + watchdog
```

### Watchdog

После dev.sh стартует **mini-service watchdog** -- мониторит dev-сервер и может
перезапустить при падении. Логи: `.zscripts/mini-service-watchdog.log`.
Не гарантированно работает. Если сервер мёртв > 30 сек: `bash .zscripts/dev.sh`

### CRITICAL: Никогда не запускай dev-сервер вручную

```bash
# Всё это НЕПРАВИЛЬНО в песочнице:
npm run dev          # НЕПРАВИЛЬНО - процесс умрёт
bun run dev          # НЕПРАВИЛЬНО - процесс умрёт
npx next dev         # НЕПРАВИЛЬНО - Turbopack крашится

# Единственный правильный способ:
bash /home/z/my-project/.zscripts/dev.sh
```

---

## Дерево решений: куда клонировать

```
                    ЗАЧЕМ клонировать?
                         |
            ┌────────────┼────────────┐
            |            |            |
     РАБОТАЕМ С КОДОМ  ЧИТАЕМ КОНТЕКСТ  КОПИРУЕМ ЧАСТИ
     (dev-сервер нужен) (wiki/документы)  (референс/код)
            |            |            |
     ┌──────┴──────┐    |        ┌────┴────┐
     |             |     |        |         |
  Monorepo    Single    /tmp/   /tmp/   /tmp/
  (пакеты)    Project  wiki    source  another
     |             |     |      repo    repo
     |             |     |
     v             v     v
  Стратегия 1  Стратегия 2  Стратегия 3
```

### Стратегия 1: Клонирование для dev-сервера (рабочий проект)

**Когда:** тебе нужно чтобы dev-сервер песочницы подхватил код и показал превью.

```bash
# Шаг 1: Клонируем во временную папку (--depth 1 для скорости)
git clone --depth 1 https://github.com/<ORG>/<REPO>.git /tmp/<repo-name>

# Если clone висит (большой репо / медленная сеть):
git clone --depth 1 --no-checkout <URL> /tmp/<repo-name>
cd /tmp/<repo-name> && git checkout HEAD -- .

# Шаг 2: Удаляем из рабочей папки ТОЛЬКО файлы проекта (не .zscripts/ и не upload/!)
cd /home/z/my-project
ls -A | grep -v '^.zscripts$' | grep -v '^upload$' | xargs rm -rf

# Если есть root-owned директории:
sudo chown -R z:z /home/z/my-project/skills 2>/dev/null
rm -rf /home/z/my-project/skills 2>/dev/null

# Шаг 3: Переносим файлы (ЗАЩИЩАЯ .zscripts/!)
# КРИТИЧЕСКИ ВАЖНО: rsync, НЕ cp -r (cp -r затрёт .zscripts/)
rsync -a --exclude='.zscripts/' --exclude='upload/' /tmp/<repo-name>/ /home/z/my-project/

# Fallback если rsync нет:
cp -r /home/z/my-project/.zscripts/ /tmp/zscripts-backup/
cp -r /tmp/<repo-name>/. /home/z/my-project/
rm -rf /home/z/my-project/.zscripts/
cp -r /tmp/zscripts-backup/ /home/z/my-project/.zscripts/

# Шаг 4: Git ownership (если нужен)
git config --global --add safe.directory /home/z/my-project

# Шаг 5: Запускаем dev-окружение (dev.sh делает всё сам)
bash /home/z/my-project/.zscripts/dev.sh

# Шаг 6: Проверяем
curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/
# Ожидаем: 200
```

**ВАРИАНТ B -- если repo ПУСТАЯ (создаём с нуля):**

```bash
cd /home/z/my-project
git init
git config --global --add safe.directory /home/z/my-project
git remote add origin https://<TOKEN>@github.com/<ORG>/<REPO>.git
git add -A && git commit -m "init: project setup" && git push -u origin main
```

**ВАРИАНТ C -- обновить уже клонированный проект:**

```bash
cd /home/z/my-project && git pull origin main
```

### Стратегия 2: Клонирование для чтения (wiki, документация)

**Когда:** тебе нужно прочитать контекст, решения, документацию. Dev-сервер не нужен.

```bash
git clone --depth 1 <WIKI_URL> /tmp/wiki
# Читаешь из /tmp/wiki/
```

**Почему НЕ в `/home/z/my-project/`:** файлы wiki не являются частью Next.js проекта
и могут сломать dev-сервер.

### Стратегия 3: Клонирование для референса (копирование кусков)

```bash
# Shallow clone
git clone --depth 1 https://github.com/<ORG>/<SOURCE>.git /tmp/source

# Или sparse checkout (если нужен только пару файлов из огромного репо):
git clone --filter=blob:none --sparse <URL> /tmp/source
cd /tmp/source && git sparse-checkout set path/to/folder

# Копируем нужные файлы
cp /tmp/source/path/to/file.tsx /home/z/my-project/src/components/
```

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

## Стандарт начала сессии

### Шаблон для 3A Studio (копируй и вставь)

```
Работаю над 3A Studio. Phase 3 -- Flow Editor.

Step 1 -- Клонировать ВСЕ репо (wiki + рабочий + все источники):
git clone https://github.com/stsgs1980/StsDev-Wiki.git /tmp/wiki
git clone --depth 1 https://github.com/stsgs1980/3a-studio.git /tmp/3a-studio
git clone --depth 1 https://github.com/stsgs1980/MVP-Flow-Studio-Pro.git /tmp/mvp-flow
git clone --depth 1 https://github.com/stsgs1980/Flow-Studio-Pro.git /tmp/flow-pro
git clone --depth 1 https://github.com/stsgs1980/P-mas-studio.git /tmp/p-mas-studio
git clone --depth 1 https://github.com/stsgs1980/prompting-v0.0.git /tmp/prompting-v0
git clone --depth 1 https://github.com/stsgs1980/P-MAS-architector.git /tmp/architector
git clone --depth 1 https://github.com/stsgs1980/Zai-agent-toolkit.git /tmp/toolkit

Step 2 -- Прочитать контекст:
/tmp/wiki/decisions/synthesis-strategy.md
/tmp/wiki/projects/3a-studio-master-plan.md

Step 3 -- Рабочий проект в /home/z/my-project/:
cd /home/z/my-project && ls -A | grep -v '^.zscripts$' | grep -v '^upload$' | xargs rm -rf
rsync -a --exclude='.zscripts/' --exclude='upload/' /tmp/3a-studio/ /home/z/my-project/
bash /home/z/my-project/.zscripts/dev.sh

Step 4 -- НЕ пиши код с нуля! Ищи в /tmp/mvp-flow/ и /tmp/flow-pro/.
Переноси файлы в 3A Studio и сплити по anti-monolith (<=150 строк, <=3 useState).

Остановился на: [описание]
```

---

## Стандарт завершения сессии

1. **Запушить ВСЕ изменения** (рабочий репо + wiki):
   ```bash
   cd /home/z/my-project && git add -A && git commit -m "feat/fix/refactor: описание" && git push
   cd /tmp/wiki && git add -A && git commit -m "..." && git push  # если менял
   ```

2. **Сообщить:** где остановился, что сделано, что дальше, какие файлы менял.

3. **Если push не работает** -- немедленно сообщить. Без push = код потерян.

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
# Рабочий проект -> /home/z/my-project/ (через /tmp/)
git clone --depth 1 <repo> /tmp/repo
cd /home/z/my-project && ls -A | grep -v '^.zscripts$' | grep -v '^upload$' | xargs rm -rf
rsync -a --exclude='.zscripts/' --exclude='upload/' /tmp/repo/ /home/z/my-project/
bash .zscripts/dev.sh

# Проверка сервера
curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/

# Перезапуск сервера
pkill -f 'next dev'; sleep 1; bash .zscripts/dev.sh

# Push
git remote set-url origin https://<TOKEN>@github.com/org/repo.git && git push

# Восстановление .zscripts/
git checkout -- .zscripts/

# Git lockup recovery
rm -rf .git/rebase-merge .git/rebase-apply
rm -f .git/MERGE_HEAD .git/MERGE_MSG .git/index.lock
git reset --hard HEAD
```
