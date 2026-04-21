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
set PRISMA_SCHEMA=%BACKEND_DIR%\prisma\schema.prisma

:: ------------------------------------------------------------
:: DETECTAR MOTOR DE BASE DE DATOS
:: ------------------------------------------------------------
echo Detectando motor de base de datos...

set DB_PROVIDER=
set IN_DATASOURCE=0

for /f "usebackq delims=" %%L in ("%PRISMA_SCHEMA%") do (

    :: Detectar inicio del bloque datasource
    echo %%L | findstr /i "datasource db" >nul
    if not errorlevel 1 (
        set IN_DATASOURCE=1
    )

    :: Detectar fin del bloque datasource
    echo %%L | findstr /i "}" >nul
    if not errorlevel 1 (
        if !IN_DATASOURCE!==1 (
            set IN_DATASOURCE=0
        )
    )

    :: Si estamos dentro del datasource, buscar provider
    if !IN_DATASOURCE!==1 (
        echo %%L | findstr /i "provider" >nul
        if not errorlevel 1 (
            for /f "tokens=2 delims== " %%A in ("%%L") do (
                set RAW_PROVIDER=%%A
            )
        )
    )
)

:: Limpiar comillas y espacios
set DB_PROVIDER=%RAW_PROVIDER:"=%
set DB_PROVIDER=%DB_PROVIDER: =%

echo Motor detectado: %DB_PROVIDER%
echo.

:: ------------------------------------------------------------
:: PREPARAR BASE DE DATOS SEGUN MOTOR
:: ------------------------------------------------------------

cd /d "%BACKEND_DIR%"

if /i "%DB_PROVIDER%"=="sqlite" (
    echo Usando SQLite...
    if not exist "dev.db" (
        echo No existe dev.db, creando base de datos SQLite...
        call npx prisma db push
    ) else (
        echo Base de datos SQLite OK.
    )
) else if /i "%DB_PROVIDER%"=="postgresql" (
    echo Usando PostgreSQL...
    echo Ejecutando migraciones...
    call npx prisma migrate deploy
) else (
    echo ERROR: No se reconoce el motor de base de datos.
    echo Revisa el archivo schema.prisma
    pause
    exit /b
)

echo.

:: ------------------------------------------------------------
:: DEPENDENCIAS FRONTEND
:: ------------------------------------------------------------
echo Comprobando dependencias del frontend...

if not exist "%FRONTEND_DIR%\node_modules" (
    echo Instalando dependencias del frontend...
    cd /d "%FRONTEND_DIR%"
    call npm install
) else (
    echo Dependencias del frontend OK.
)

echo.

:: ------------------------------------------------------------
:: DEPENDENCIAS BACKEND
:: ------------------------------------------------------------
echo Comprobando dependencias del backend...

if not exist "%BACKEND_DIR%\node_modules" (
    echo Instalando dependencias del backend...
    cd /d "%BACKEND_DIR%"
    call npm install
) else (
    echo Dependencias del backend OK.
)

echo.

:: ------------------------------------------------------------
:: INICIAR SERVIDORES
:: ------------------------------------------------------------
echo Iniciando Backend...
start "Unyona Backend" cmd.exe /k "cd /d %BACKEND_DIR% && npm run dev"

echo Iniciando Frontend...
start "Unyona Frontend" cmd.exe /k "cd /d %FRONTEND_DIR% && npm run dev"

echo ================================
echo Todo listo. Unyona esta en marcha.
echo ================================
pause
