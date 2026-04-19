@echo off
title Unyona Launcher
setlocal enabledelayedexpansion

echo ================================
echo Iniciando entorno Unyona...
echo ================================
echo.

:: ------------------------------------------------------------
:: RUTAS DEL PROYECTO
:: ------------------------------------------------------------
set UNYONA_DIR=C:\aplic\unyona
set FRONTEND_DIR=%UNYONA_DIR%\frontend
set BACKEND_DIR=%UNYONA_DIR%\backend

:: ------------------------------------------------------------
:: INSTALANDO SQLITE SI NO EXISTE
:: ------------------------------------------------------------

echo Comprobando base de datos SQLite...

cd /d "%BACKEND_DIR%"

if not exist "dev.db" (
    echo No existe dev.db, creando base de datos SQLite...
    call npx prisma db push
) else (
    echo Base de datos SQLite OK.
)
echo.

:: ------------------------------------------------------------
:: INSTALAR DEPENDENCIAS SI FALTAN
:: ------------------------------------------------------------
echo Comprobando dependencias del frontend...

if not exist "%FRONTEND_DIR%\node_modules" (
    echo Instalando dependencias del frontend...
    cd /d "%FRONTEND_DIR%"
    call npm install
) else (
    echo Dependencias del frontend OK.
)

echo Comprobando plugin React de Vite...

if not exist "%FRONTEND_DIR%\node_modules\@vitejs\plugin-react" (
    echo Instalando @vitejs/plugin-react compatible con Vite 5...
    cd /d "%FRONTEND_DIR%"
    call npm install @vitejs/plugin-react@4 --save-dev
) else (
    echo Plugin React OK.
)
echo.

echo Comprobando libreria react-icons...

if not exist "%FRONTEND_DIR%\node_modules\react-icons" (
    echo Instalando react-icons...
    cd /d "%FRONTEND_DIR%"
    call npm install react-icons --save
) else (
    echo react-icons OK.
)
echo.

echo Comprobando react-router-dom...

if not exist "%FRONTEND_DIR%\node_modules\react-router-dom" (
    echo Instalando react-router-dom...
    cd /d "%FRONTEND_DIR%"
    call npm install react-router-dom --save
) else (
    echo react-router-dom OK.
)
echo.

echo Comprobando dependencias del backend...

if not exist "%BACKEND_DIR%\node_modules" (
    echo Instalando dependencias del backend...
    cd /d "%BACKEND_DIR%"
    call npm install
) else (
    echo Dependencias del backend OK.
)
echo.

echo Comprobando multer (subida de archivos)...

if not exist "%BACKEND_DIR%\node_modules\multer" (
    echo Instalando multer...
    cd /d "%BACKEND_DIR%"
    call npm install multer --save
) else (
    echo Multer OK.
)
echo.

:: ------------------------------------------------------------
:: INICIAR UNYONA (npm run dev en el root)
:: ------------------------------------------------------------
echo Iniciando Backend...
start "Unyona Backend" cmd.exe /k "cd /d %BACKEND_DIR% && npm run dev"

echo Iniciando Frontend...
start "Unyona Frontend" cmd.exe /k "cd /d %FRONTEND_DIR% && npm run dev"

echo ================================
echo Todo listo. Unyona esta en marcha.
echo ================================
pause
