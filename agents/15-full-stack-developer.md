---
Task ID: 15
Agent: full-stack-developer
Task: Bug fixes + styling improvements + new features

Work Log:
- Read worklog.md (20+ previous entries) and full page.tsx (435 lines orchestrator)
- Read HeroSection.tsx, HowToStart.tsx, FooterSection.tsx, DemoSection.tsx, ThemeToggle.tsx
- Read globals.css (~2580 lines) for existing CSS utilities
- Verified dev server returns 200 and ESLint passes clean

### Bug Fixes (2):
1. **Hero heading "всёи" spacing issue** (HeroSection.tsx line 127): Replaced `{'\u00A0'}` (non-breaking space) with `{' '}` (regular space) between the gradient span and "и не разориться". The non-breaking space was being stripped in the accessibility tree, creating "помнить всёи не разориться".
2. **Stale "32" references check**: Grepped all .tsx/.ts files for `\b32\b`. Found 7 matches — all legitimate (font sizes in InteractiveExplorer, 32K tokens in RoadmapSection, max-h-32 in MemoryPlayground, w-32 h-32 and SVG viewBox in HeroSection). No stale demo count references exist; hero badges and footer correctly show "34".

### Styling Improvements (4):
1. Mobile touch targets in DemoSection.tsx (min-h-[44px] on 3 button types)
2. HowToStart animated connecting elements (dashed lines + pulse dots)
3. Reusable fade-in-up animation class (.animate-fade-in-up)
4. Footer gradient border-top + hover effects

### New Features (3):
1. Reading Progress indicator (3px, hidden until past hero, gradient)
2. Active nav link bookmark indicator (desktop + mobile)
3. Dark mode toggle rotation animation (500ms, double-click guard)

Files Modified:
- src/components/landing/HeroSection.tsx
- src/components/landing/DemoSection.tsx
- src/components/landing/HowToStart.tsx
- src/components/landing/FooterSection.tsx
- src/components/ui/ThemeToggle.tsx
- src/app/page.tsx
- src/app/globals.css
- worklog.md

Stage Summary:
- ESLint: 0 errors
- Dev server: HTTP 200
- 2 bug fixes, 4 styling improvements, 3 new features
- No new files created
