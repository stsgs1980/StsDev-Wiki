# Стандарт работы в Z.ai песочнице

**Дата:** 2026-05-27 | **Обновлено:** 2026-05-27
**Для кого:** stsgs1980 и любой AI-агент в новой сессии
**Статус:** универсальный стандарт (не привязан к конкретному проекту)

---

## Суть проблемы

Песочница Z.ai = **ephemeral контейнер**. Каждая новая сессия = чистая машина.
Ничего не сохраняется между сессиями. Всё что не запушено в GitHub — потеряно навсегда.

Поэтому песочница = **не хранилище, а рабочая поверхность**.
Хранилище = GitHub. Песочница = временная копия на пару часов.

---

## Базовые ограничения

| Правило | Почему |
|---------|--------|
| Рабочая папка = **ТОЛЬКО** `/home/z/my-project/` | Dev-сервер песочницы жёстко привязан к этому пути |
| `.zscripts/` внутри `/home/z/my-project/` = инфраструктура песочницы | **НЕ удалять**, **НЕ перезаписывать** |
| Git push = единственный способ сохранить результат | Нет долговременного диска |
| Песочница **НЕ имеет** gh CLI, нет SSH-ключей, нет stored credentials | Для push/pull нужен PAT токен |
| Сессия может оборваться в любой момент | Коммити часто |
| npm/bun/node/python = есть | Основной стек доступен |

---

## Дерево решений: куда клонировать

### Главный вопрос: ЗАЧЕМ тебе этот репозиторий в песочнице?

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

**Куда:** ПРЯМО в `/home/z/my-project/` (не в подпапку!)

**Проблема:** `/home/z/my-project/` НЕ пустая — там заготовка Next.js проекта.
Нельзя просто `git clone` туда — будет конфликт (destination already exists).

**Решение — клонирование через промежуточную папку:**

```bash
# Шаг 1: Клонируем во временную папку
git clone https://github.com/<ORG>/<REPO>.git /tmp/<repo-name>

# Шаг 2: Удаляем из рабочей папки ТОЛЬКО файлы проекта (не .zscripts!)
cd /home/z/my-project
ls -A | grep -v '.zscripts' | xargs rm -rf

# Шаг 3: Переносим файлы проекта
cp -r /tmp/<repo-name>/* /home/z/my-project/
cp /tmp/<repo-name>/.gitignore /home/z/my-project/ 2>/dev/null
cp -r /tmp/<repo-name>/.git /home/z/my-project/ 2>/dev/null

# Шаг 4: Зависимости
cd /home/z/my-project && bun install
```

**ВАРИАНТ B — если repo ПУСТАЯ (создаём с нуля):**

```bash
# Ничего не клонируем. Работаем прямо в /home/z/my-project/
# Когда код готов -- создаём репо на GitHub и пушим:
cd /home/z/my-project
git init
git remote add origin https://github.com/<ORG>/<REPO>.git
git add -A
git commit -m "init: project setup"
git push -u origin main
```

**ВАРИАНТ C — если нужно обновить уже клонированный проект:**

```bash
# В /home/z/my-project/ уже лежит проект с .git
cd /home/z/my-project
git pull origin main
```

### Стратегия 2: Клонирование для чтения (wiki, документация)

**Когда:** тебе нужно прочитать контекст, решения, документацию.
Dev-сервер не нужен.

**Куда:** В `/tmp/` или любую другую папку КРОМЕ `/home/z/my-project/`.

```bash
git clone https://github.com/<ORG>/<WIKI>.git /tmp/wiki

# Читаешь из /tmp/wiki/
# НЕ пишешь туда (или если пишешь — потом git push)
```

**Почему НЕ в `/home/z/my-project/`:** файлы wiki (markdown, изображения) не являются частью
Next.js проекта и могут сломать dev-сервер или конфликтовать с реальным проектом.

### Стратегия 3: Клонирование для референса (копирование кусков)

**Когда:** тебе нужно подсмотреть код из другого репо и скопировать часть в рабочий проект.

**Куда:** В `/tmp/`.

```bash
# Клонируем референс-репо целиком (или shallow если большое)
git clone --depth 1 https://github.com/<ORG>/<SOURCE>.git /tmp/source

# Или shallow clone конкретной ветки
git clone --depth 1 --branch <branch> https://github.com/<ORG>/<SOURCE>.git /tmp/source

# Копируем нужные файлы
cp /tmp/source/path/to/file.tsx /home/z/my-project/src/components/
```

**ВАРИАНТ — sparse checkout (если нужно только пару файлов из огромного репо):**

```bash
git clone --filter=blob:none --sparse https://github.com/<ORG>/<SOURCE>.git /tmp/source
cd /tmp/source
git sparse-checkout set path/to/folder another/path
# Теперь скачаны только нужные файлы
```

---

## Аутентификация

Песочница **НЕ имеет** gh CLI, нет SSH-ключей, нет credential manager.

Единственный способ push/pull к приватным репо — **PAT токен** (Personal Access Token).

```bash
# Один раз в начале сессии для каждого приватного репо:
git remote set-url origin https://<TOKEN>@github.com/<ORG>/<REPO>.git

# После этого работает обычный git push / git pull
```

**Безопасность:** PAT передаётся в рамках одной сессии песочницы. Когда сессия закрывается — всё стирается. Но НЕ коммить `.git/config` с токеном в репо!

---

## Стандарт начала сессии

### Шаблон для 3A Studio (копируй и вставь)

```
Работаю над 3A Studio. Phase 3 — Flow Editor.

Step 1 — Клонировать ВСЕ репо (wiki + рабочий + все источники):
git clone https://github.com/stsgs1980/StsDev-Wiki.git /tmp/wiki
git clone https://github.com/stsgs1980/3a-studio.git /tmp/3a-studio
git clone --depth 1 https://github.com/stsgs1980/MVP-Flow-Studio-Pro.git /tmp/mvp-flow
git clone --depth 1 https://github.com/stsgs1980/Flow-Studio-Pro.git /tmp/flow-pro
git clone --depth 1 https://github.com/stsgs1980/P-mas-studio.git /tmp/p-mas-studio
git clone --depth 1 https://github.com/stsgs1980/prompting-v0.0.git /tmp/prompting-v0
git clone --depth 1 https://github.com/stsgs1980/P-MAS-architector.git /tmp/architector
git clone --depth 1 https://github.com/stsgs1980/Zai-agent-toolkit.git /tmp/toolkit

Step 2 — Прочитать контекст:
/tmp/wiki/decisions/synthesis-strategy.md
/tmp/wiki/projects/3a-studio-master-plan.md

Step 3 — Рабочий проект в /home/z/my-project/:
cd /home/z/my-project && ls -A | grep -v '.zscripts' | xargs rm -rf
cp -r /tmp/3a-studio/. /home/z/my-project/
bun install

Step 4 — НЕ пиши код с нуля! Ищи в /tmp/mvp-flow/ и /tmp/flow-pro/.
Переноси файлы в 3A Studio и сплити по anti-monolith (<=150 строк, <=3 useState).

Остановился на: [описание]
```

### Чек-лист для агента (что сделать первым делом)

1. **Клонировать ВСЕ репо** (wiki + рабочий + все 6 источников) -- НЕ пропусти ни одного!
2. Прочитать `/tmp/wiki/decisions/synthesis-strategy.md` -- там карта файлов по фазам
3. Прочитать `/tmp/wiki/projects/3a-studio-master-plan.md` -- текущая фаза и задачи
4. Перенести рабочий код в `/home/z/my-project/` (с сохранением `.zscripts/`)
5. `bun install`
6. **Для каждой задачи:** найти файл в `/tmp/mvp-flow/` или `/tmp/p-mas-studio/`, перенести и сплитить
7. Anti-monolith проверка: каждый файл <=150 строк, <=3 useState
8. Сообщить пользователю: "Контекст загружен. Нашёл следующие файлы для текущей фазы: ..."

---

## Стандарт завершения сессии

### Перед тем как закрыть/отойти

1. **Запушить ВСЕ изменения** (и в рабочий репо, и в wiki если менял):
   ```bash
   # Рабочий репо
   cd /home/z/my-project && git add -A && git status
   git commit -m "feat/fix/refactor: описание"
   git push origin main

   # Wiki (если менял)
   cd /tmp/wiki && git add -A && git commit -m "..." && git push
   ```

2. **Сообщить в чат где остановился:**
   ```
   Остановился на: Phase X, задача Y.
   Что сделано: список
   Что дальше: следующий шаг
   Файлы которые менял: список
   ```

3. **Если push не работает** — немедленно сообщить пользователю.
   Без push = без сохранения = код потерян.

---

## Если сессия оборвалась

### Сценарий 1: Код был запушен

Ничего не потеряно. Начинаем новую сессию:
1. `git clone` wiki — читаем контекст
2. `git clone` рабочий репо — получаем последний код
3. `git log --oneline -10` — видим последние коммиты, понимаем где были
4. Продолжаем

### Сценарий 2: Код НЕ был запушен

Код потерян. Но:
- Wiki сохранена (если запушили)
- Все предыдущие коммиты рабочего репо сохранены
- Нужно пересоздать только то что делал в последней сессии

**Как минимизировать потери:** коммити и пуш после КАЖДОГО значимого шага.
Не жди конца сессии.

### Сценарий 3: Сессия оборвалась ПОСЛЕ push, но НЕ после последнего изменения

Маленькие правки (пару строк) могут быть потеряны. Перезапиши по памяти —
контекст в wiki и в истории чата.

---

## Частые ошибки

| Ошибка | Причина | Решение |
|--------|---------|---------|
| `fatal: destination path already exists` | Пытаешься clone прямо в непустую папку | Клонируй в `/tmp/`, потом копируй |
| `git push: Permission denied` | Нет токена в URL | `git remote set-url origin https://<TOKEN>@...` |
| Dev-сервер не видит проект | Клонировал в подпапку `/home/z/my-project/my-repo/` | Код должен быть ПРЯМО в `/home/z/my-project/` |
| `Port 3000 already in use` | Запустил dev-сервер вручную | Не делай этого. Песочница управляет сама. |
| При clone удалил `.zscripts/` | `rm -rf` без фильтра | Всегда фильтруй: `ls -A \| grep -v '.zscripts' \| xargs rm -rf` |
| Wiki сломала dev-сервер | Клонировал wiki в `/home/z/my-project/` | Wiki только в `/tmp/` |
| Huge clone, timeout | Репо слишком большой | `git clone --depth 1` (shallow) |
| Нужен только один файл из репо | Клонируешь всё | `git clone --filter=blob:none --sparse` |

---

## Быстрая шпаргалка

```
# Рабочий проект -> /home/z/my-project/ (через /tmp/)
git clone <repo> /tmp/repo && cd /home/z/my-project && ls -A | grep -v '.zscripts' | xargs rm -rf && cp -r /tmp/repo/. /home/z/my-project/

# Wiki/доки -> /tmp/
git clone <wiki> /tmp/wiki

# Референс -> /tmp/
git clone --depth 1 <repo> /tmp/ref

# Push (нужен токен)
git remote set-url origin https://<TOKEN>@github.com/org/repo.git && git push

# Частый коммит
git add -A && git commit -m "msg" && git push
```
