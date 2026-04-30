@echo off
title Unyona Launcher
setlocal

echo ================================
echo Iniciando entorno Unyona (PostgreSQL + Prisma 5)
echo ================================
echo.

:: ------------------------------------------------------------
:: RUTAS DEL PROYECTO
:: ------------------------------------------------------------
set UNYONA_DIR=C:\Cursos\react\apps\unyona
set BACKEND_DIR=%UNYONA_DIR%\backend
set FRONTEND_DIR=%UNYONA_DIR%\frontend

:: ------------------------------------------------------------
:: BACKEND
:: ------------------------------------------------------------
echo [1/4] Preparando backend...
cd /d "%BACKEND_DIR%"

:: ----------------------------------
:: Dependencias backend
:: ----------------------------------
if not exist "node_modules" (
    echo Instalando dependencias del backend...
    call npm install
) else (
    echo Dependencias del backend OK.
)

:: ----------------------------------
:: Forzar Prisma estable (v5)
:: ----------------------------------
echo Verificando version de Prisma...

call npm install prisma@5 @prisma/client@5 --save-dev

:: ----------------------------------
:: Archivo .env
:: ----------------------------------
if not exist ".env" (
    echo Creando archivo .env desde .env.example...
    copy ".env.example" ".env" >nul
) else (
    echo Archivo .env OK.
)

:: ----------------------------------
:: Prisma
:: ----------------------------------
echo Generando cliente Prisma...
call npx prisma generate

echo Ejecutando migraciones Prisma...
call npx prisma migrate deploy

echo.

:: ------------------------------------------------------------
:: FRONTEND
:: ------------------------------------------------------------
echo [2/4] Preparando frontend...
cd /d "%FRONTEND_DIR%"

if not exist "node_modules" (
    echo Instalando dependencias del frontend...
    call npm install
) else (
    echo Dependencias del frontend OK.
)

echo.

:: ------------------------------------------------------------
:: ARRANQUE
:: ------------------------------------------------------------
echo [3/4] Iniciando servicios...

echo Iniciando Backend...
start "Unyona Backend" cmd.exe /k "cd /d %BACKEND_DIR% && npm run dev"

echo Iniciando Frontend...
start "Unyona Frontend" cmd.exe /k "cd /d %FRONTEND_DIR% && npm run dev"

echo.
echo ================================
echo [4/4] Unyona listo y en ejecucion
echo ================================
pause
