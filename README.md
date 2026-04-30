

# UNYONA — Plataforma Social para Interacciones Reales

UNYONA es una aplicación web en desarrollo orientada a la construcción de **relaciones sociales reales**, comunidades locales y encuentros presenciales, mediante un sistema flexible de **usuarios y perfiles**.

A diferencia de redes sociales tradicionales, Unyona se centra en:
- Identidades sociales mediante perfiles
- Interacciones humanas naturales
- Actividad local y proximidad geográfica
- Transición del entorno digital al mundo real

El proyecto parte de una base técnica sólida y está diseñado para evolucionar progresivamente hacia una plataforma social completa.

---

## Estado del proyecto

Fase actual: Base técnica completada  
Siguiente fase: Fase 1 — Seguridad, sesión y experiencia base

---

## Visión del proyecto

### Usuarios y perfiles

Un **usuario** representa una cuenta (autenticación, control y seguridad).  
Un usuario puede crear **uno o varios perfiles**, que son las identidades sociales reales dentro de la plataforma.

Los perfiles:
- Tienen nombre, avatar y biografía
- Están asociados a un contexto o zona
- Poseen intereses propios
- Interactúan con otros perfiles

Las interacciones en Unyona **siempre ocurren entre perfiles**, no entre cuentas.  
Este enfoque permite separar contextos, mejorar la privacidad y fomentar relaciones más naturales.

---

### Usuarios de organización

Además de usuarios personales, Unyona contempla un **usuario de tipo organización**, orientado a:
- Crear y gestionar grupos
- Organizar quedadas y eventos
- Lanzar campañas o actividades lucrativas
- Administrar comunidades o espacios temáticos

Estos usuarios actúan mediante **entidades o secciones públicas**, no como perfiles personales.

---

## Arquitectura actual

### Estructura del proyecto

unyona/<br>
 ├── frontend/    → React + Vite + Tailwind<br>
 ├── backend/     → Express + Prisma + SQL<br>
 └── package.json → Orquestador para desarrollo

 ---
---

## Funcionalidades implementadas

### Backend
- Registro y login de usuarios
- Autenticación mediante JWT
- Middleware de protección (`authMiddleware`)
- Modelo Usuario
- Modelo Perfil (1 Usuario → N Perfiles)
- CRUD completo de perfiles
- Subida y gestión de imagen de perfil
- Base de datos PostgreSQL gestionada con Prisma
- API REST modular y escalable

### Frontend
- React + TypeScript + Vite
- Gestión de sesión mediante Context API
- Flujos de registro y login funcionales
- Selección de perfil activo
- Estética base del proyecto

---

## Tecnologías utilizadas

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM (PostgreSQL)
- JWT
- bcrypt

---

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado:
- Node.js v18 o superior
- npm
- PostgreSQL
- Git

---

## Instalación y arranque

### Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd unyona
```

---

### Configuración y arranque en desarrollo

El proyecto incluye un **launcher automatizado** que realiza:
- Instalación de dependencias
- Creación del archivo `.env` desde `.env.example`
- Uso forzado de Prisma estable (v5)
- Generación del cliente Prisma
- Ejecución de migraciones
- Arranque de frontend y backend

Para iniciar el entorno de desarrollo:
run-unyona.bat

---

## Funcionamiento general

### Acceso sin sesión
- Landing pública
- Registro o login

### Autenticación
- Generación de token JWT
- Persistencia de sesión en frontend
- Validación en backend mediante middleware

### Perfiles
- Un usuario puede crear múltiples perfiles
- Cada perfil tiene identidad y contexto propios
- El perfil activo define la interacción dentro de la plataforma

---

## Roadmap

### Completado
- Base técnica backend y frontend
- Autenticación y sesión
- Sistema de perfiles
- PostgreSQL unificado
- Arranque automatizado del entorno

### Fase 1 — Seguridad y experiencia base
- Protección de rutas en el frontend
- Gestión robusta de sesión
- Bloqueo de accesos sin token
- Mostrar nombre e imagen del perfil activo
- Protección de recursos privados (imágenes y rutas)

### Fases futuras
- Conexiones entre perfiles
- Chat en tiempo real (1 a 1 y grupal)
- Grupos y comunidades
- Quedadas y eventos presenciales
- Usuarios de organización
- Escalado progresivo de funcionalidades sociales

---

## Notas finales

Unyona está diseñada para crecer de forma progresiva, realista y mantenible, priorizando:
- Relaciones humanas reales
- Comunidades locales
- Arquitectura sólida
- Evolión continua del producto

Este repositorio representa el punto de partida técnico de una plataforma social con enfoque humano y local.