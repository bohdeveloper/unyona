# UNYONA – Plataforma Social para Eventos

UNYONA es una aplicación web en desarrollo orientada a la gestión social de eventos.  
Incluye:

- Registro y login de usuarios  
- Perfiles por usuario  
- Autenticación mediante JWT  
- Backend con Express + TypeScript  
- Base de datos SQL mediante Prisma (PostgreSQL o SQLite)  
- Frontend con React + Vite + Tailwind  

> **Estado del proyecto:**  
> Esta versión actúa como base técnica para el desarrollo de la plataforma final.

---

## 1. Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (v18 o superior)  
- npm  
- PostgreSQL **o** SQLite  
- Git  

---

## 2. Descarga del proyecto

Clonar el repositorio:

bash
git clone <URL_DEL_REPOSITORIO>
cd unyona

---

## Estructura del proyecto:

unyona/
 ├── frontend/    → React + Vite + Tailwind
 ├── backend/     → Express + Prisma + SQL
 └── package.json → Orquestador para desarrollo

 ---

## 3. Configuración del Backend
Entrar en la carpeta backend:

bash
cd backend
npm install

## Crear archivo .env:

PORT=5000
DATABASE_URL="postgresql://usuario:password@localhost:5432/unyona?schema=public"
JWT_SECRET=clave_super_secreta

## Si prefieres SQLite en desarrollo:

DATABASE_URL="file:./dev.db"
Generar cliente Prisma:
bash
npx prisma generate
Crear la base de datos y aplicar migraciones:
bash
npx prisma migrate dev

---

## 4. Configuración del Frontend
## Entrar en la carpeta frontend:

bash
cd ../frontend
npm install

## Crear archivo .env:
VITE_API_URL=http://localhost:5000

---

## 5. Arranque de la aplicación
Desde la carpeta raíz:

bash
npm install
npm run dev

Esto iniciará:

Frontend → http://localhost:5173

Backend → http://localhost:5000

---

## 6. Funcionamiento general
Acceso sin sesión:
Landing pública

Registro o login

Registro:
Se crea el usuario en SQL mediante Prisma

Se genera un token JWT

El frontend lo almacena en localStorage

Login:
Validación de credenciales

Generación de token

Redirección a zona autenticada

Perfiles:
Cada usuario puede crear varios perfiles

Cada perfil puede tener avatar, modo infantil, etc.

Sesión:
Mientras exista el token, el usuario permanece autenticado

---

## 7. Base de datos
Motor SQL mediante Prisma:

PostgreSQL (recomendado para producción)

SQLite (ideal para desarrollo local)

Tablas principales:

Usuario

Perfil

Favorito

Historial

Preferencia

---

## 8. Tecnologías utilizadas
Frontend:
React

TypeScript

Vite

Tailwind CSS

React Router

Backend:
Node.js

Express

TypeScript

Prisma ORM

JWT

bcrypt

---

## 9. Notas finales
Proyecto preparado para futuras ampliaciones:

Sistema social para eventos

Perfiles públicos

Feed de actividad

Seguidores

Subida de contenido

Notificaciones

---

El backend expone una API REST modular y escalable.

El frontend utiliza Context API para la gestión de sesión.