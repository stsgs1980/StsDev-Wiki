# Ситуативный гайд: Preview & Dev Server в Z.ai Sandbox

**Дата:** 2026-05-28 | **Статус:** активный
**Для кого:** любой AI-агент в сессии со сложным Next.js проектом (multi-route, >50 файлов)

---

## Проблема

В песочнице есть 3 документа о preview/sandbox:
1. `upload/ZAI_SANDBOX_INSTRUCTIONS.md` — общая инструкция
2. `skills/dev-watchdog/SKILL.md` — протокол keepalive
3. `skills/fullstack-dev/SKILL.md` — fullstack стек

Все три написаны для **одностраничных демо** (1 файл page.tsx, 1 роут).
Для 3A Studio (multi-route IDE, 100+ файлов) часть правил НЕВЕРНА.

Этот документ — **ситуативная таблица**: что применять, когда, и что игнорировать.

---

## Архитектура sandbox (факты, не правила)

```
Browser (Preview Panel / IM preview link)
    |
    v
Caddy (:81) — reverse proxy
    |
    |-- ?XTransformPort=<port> --> localhost:<port>  (mini-services)
    |
    |-- default --> localhost:3000  (Next.js)
                       |
                       v
                 Next.js 15.5
                 dev: next dev --turbopack (auto, или manual)
                 prod: next start -p 3000 -H 0.0.0.0
```

**Ключевой факт:** Caddy проксирует ВСЕ пути. `/dashboard`, `/editor`, `/api/*` — всё работает.
Правило "User can only see the / route" из fullstack-dev SKILL.md = **ЛОЖЬ для multi-route проектов**.

---

## Быстрое решение: что делать

### При старте сессии

```bash
# 1. Проверить состояние
ss -tlnp | grep -E ':3000|:81'
curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/

# 2. Если сервер мёртв (000) — выбрать режим:
# Для ПРОСТЫХ проектов (< 10 файлов, 1 роут):
cd /home/z/my-project && npx next dev -p 3000 </dev/null >/tmp/zdev.log 2>&1 & disown
sleep 6

# Для СЛОЖНЫХ проектов (multi-route, heavy client components):
cd /home/z/my-project && npx next build 2>&1 | tail -20
# Если билд ок:
NODE_OPTIONS="--max-old-space-size=4096" npx next start -p 3000 -H 0.0.0.0 </dev/null >/tmp/zdev.log 2>&1 & disown
```

### Если превью не показывает контент

```bash
# Проверяем что именно отдаётся
curl -s -D - http://127.0.0.1:3000/ | head -15        # корневой путь
curl -s -D - http://127.0.0.1:3000/dashboard | head -15  # конкретный роут

# Ожидаемое:
# 200 + HTML контент = сервер работает, проблема в Preview Panel / Caddy
# 307 + location: /dashboard = редирект, нормальное поведение
# 500 = ошибка компиляции, смотреть /tmp/zdev.log
# 000 = сервер мёртв, перезапускать
```

---

## Ситуационная таблица правил

### ZAI_SANDBOX_INSTRUCTIONS.md

| Правило | Когда ВЕРНО | Когда НЕВЕРНО |
|---------|-------------|---------------|
| "Весь код в page.tsx" | Демо, лендинг, калькулятор | Multi-page app (3A Studio, CRM, IDE) |
| "Не создавай другие роуты" | Одностраничное демо | У проекта > 1 экрана |
| "Не запускай dev сервер вручную" | Init-скрипт уже запустил его | Сервер упал, нужен ручной перезапуск |
| "Перезапускай через init-скрипт" | Начало работы с нуля | **НИКОГДА на рабочем проекте** — уничтожит код |
| "Не используй bun run build" | Dev-only workflow | Нужен production mode для тяжёлых проектов |
| "Preview Panel обновляется автоматически" | Dev mode (next dev) | Production mode (next start) — нужен rebuild |
| "Aliasing @/" | Всегда | — |
| "Не давай localhost URL" | Всегда | — |
| "Логи в .zscripts/dev.log" | Init-скриптовый запуск | Ручной запуск — логи в /tmp/zdev.log |

### dev-watchdog SKILL.md

| Правило | Когда ВЕРНО | Когда НЕВЕРНО |
|---------|-------------|---------------|
| "npx next dev" | Простой проект, < 500MB RAM | Сложный проект — Turbopack жрёт 825MB+ и падает |
| "127.0.0.1 не localhost" | Всегда | — |
| "disown + </dev/null" | Всегда при ручном запуске | — |
| "Ждать 6 сек" | Turbopack cold compile | Production mode — готов через 1 сек |
| "Cron watchdog каждые 5 мин" | Всегда | — |
| "Перезапуск при 000" | Всегда | — |
| "При 500 — не рестартить, чинить код" | Всегда | — |
| Production mode как альтернатива | **Не упоминается** | Рекомендуется для heavy проектов |

### fullstack-dev SKILL.md

| Правило | Когда ВЕРНО | Когда НЕВЕРНО |
|---------|-------------|---------------|
| "User can only see / route" | Одностраничное демо | Multi-route — Caddy форвардит все пути |
| "Do NOT write any other route" | Одностраничное демо | Multi-page app |
| "Never use bun run build" | Dev-only | Нужен production build |
| "bun run dev runs automatically" | После init-скрипта | Сервер умирает через ~5 мин |
| "XTransformPort для API" | Всегда | — |
| "Relative paths для API" | Всегда | — |
| "z-ai-web-dev-sdk backend only" | Всегда | — |
| "shadcn/ui + responsive" | Всегда | — |
| "Стартовый скрипт: curl init..." | Только ПЕРВЫЙ раз | На рабочем проекте — уничтожит всё |

---

## Dev mode vs Production mode

### Dev mode (next dev --turbopack)

```
Плюсы:
+ Hot reload (HMR) — изменения видны мгновенно
+ Не нужен билд
+ Автоматический TypeScript check

Минусы:
- Жрёт 800MB+ RAM на сложных проектах
- Turbopack падает при большом количестве client components
- Умирает через ~5 мин в sandbox
- Первый запрос может быть >10 сек (cold compile)
```

### Production mode (next build + next start)

```
Плюсы:
+ Стабильно (214MB RAM)
+ Быстрые ответы
+ Не падает
+ Не умирает от таймаута (process stays alive)

Минусы:
- Нет HMR — каждый раз нужен rebuild
- rebuild занимает 8-15 сек
- Нужно вручную перезапускать сервер после билда
```

### Когда что использовать

```
Проект простой (< 10 файлов, 1-2 роута, нет анимаций)
  --> Dev mode (next dev)

Проект средний (10-50 файлов, несколько роутов, лёгкие компоненты)
  --> Dev mode, но иметь production fallback

Проект сложный (50+ файлов, много client components, SVG анимации)
  --> Production mode по умолчанию
  --> Dev mode ТОЛЬКО если нужно итеративно править 1-2 файла

3A Studio
  --> Production mode. Turbopack падал при компиляции dashboard.
```

---

## Шаблон start-of-session для 3A Studio

```bash
# 1. Клонировать ВСЕ репо (см. sandbox-workflow.md)
git clone https://github.com/stsgs1980/StsDev-Wiki.git /tmp/wiki
git clone --depth 1 https://github.com/stsgs1980/P-mas-studio.git /tmp/p-mas-studio
git clone --depth 1 https://github.com/stsgs1980/P-MAS-architector.git /tmp/architector
# ... остальные по списку из sandbox-workflow.md

# 2. Загрузить рабочий код
cd /home/z/my-project && git pull origin main

# 3. Проверить/запустить сервер
ss -tlnp | grep -E ':3000|:81'
STATUS=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/)

if [ "$STATUS" = "000" ]; then
  # Сервер мёртв — production mode
  cd /home/z/my-project
  npx next build 2>&1 | tail -5
  pkill -f 'next' 2>/dev/null; sleep 1
  NODE_OPTIONS="--max-old-space-size=4096" npx next start -p 3000 -H 0.0.0.0 </dev/null >/tmp/zdev.log 2>&1 & disown
  sleep 3
  curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/
fi

# 4. Читать контекст
/tmp/wiki/decisions/synthesis-strategy.md
/tmp/wiki/projects/3a-studio-master-plan.md
```

---

## Чек-лист: preview не работает

1. Сервер жив? `curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/`
   - 000 → убит, перезапускать
   - 200 → сервер ок, проблема ниже
   - 307 → редирект, норма
   - 500 → ошибка компиляции

2. Caddy жив? `curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:81/`
   - 000 → Caddy упал
   - 200 → Caddy ок

3. Что отдаётся? `curl -s http://127.0.0.1:3000/dashboard | wc -c`
   - 0 байт → пустой ответ
   - > 1000 байт → контент есть

4. Логи: `cat /tmp/zdev.log | tail -20`

5. Если всё ок с сервером но preview пустой — проблема на стороне Preview Panel (вне контроля агента)
