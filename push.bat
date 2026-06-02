@echo off
cd /d "%~dp0"

echo.
echo === Verifying documentation consistency ===
where bun >nul 2>nul
if %errorlevel%==0 (
    bun run tools\verify-docs\src\cli.ts
    if %errorlevel% neq 0 (
        echo.
        echo PUSH BLOCKED: Documentation has inconsistencies.
        echo Fix the issues above, or push manually with: git push --no-verify
        pause
        exit /b 1
    )
) else (
    echo [warn] bun not found — skipping verify-docs
)

echo.
echo === Pushing ===
git add -A
git commit -m "update %date% %time%"
git push
pause
