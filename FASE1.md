## Fase 1 — Consolidación (corto plazo)
Objetivo general: estabilidad técnica, seguridad y experiencia base de usuario.

---

### 1. Gestión de autenticación en frontend

**Objetivo:** centralizar y robustecer la sesión del usuario.

Tareas:
- ✅ Crear `AuthContext` con:
  - estado de sesión (token, usuario autenticado)
  - métodos `login`, `logout`, `restoreSession`
- ✅ Inicializar la sesión al cargar la aplicación
- ✅ Validar formato y existencia del token
- ✅ Manejar sesión inválida o expirada
- ✅ Limpiar estado y redirigir al logout cuando sea necesario

Resultado esperado:
- ✅ Gestión de autenticación centralizada y predecible
- ✅ Persistencia de sesión tras refrescar la página

---

### 2. Protección de rutas del frontend

**Objetivo:** impedir el acceso a zonas privadas sin autenticación.

Tareas:
- ✅ Crear componente `ProtectedRoute`
- ✅ Integrar `ProtectedRoute` con React Router
- ✅ Redirigir a login si no existe sesión válida
- ✅ Evitar render parcial de vistas protegidas
- ✅ Manejar estados intermedios (loading / checking session)

Resultado esperado:
- ✅ Ninguna ruta privada accesible sin token
- ✅ Navegación coherente y segura

---

### 3. Gestión global del perfil activo

**Objetivo:** definir el contexto de uso de la aplicación.

Tareas:
- ✅ Crear `ProfileContext`
- ✅Almacenar perfil activo seleccionado
- ✅ Persistir perfil activo (localStorage o backend)
- ✅ Restaurar perfil activo al recargar la aplicación
- ✅ Exponer el perfil activo de forma global

Resultado esperado:
- ✅ Toda la app conoce el perfil activo
- ✅ Base para interacciones entre perfiles

---

### 4. Integración visual del perfil activo

**Objetivo:** mejorar la experiencia de usuario y orientación visual.

Tareas:
- ✅ Mostrar avatar del perfil activo en el sidebar o header
- Mostrar nombre del perfil activo
- Actualizar UI al cambiar de perfil
- Manejar correctamente estados sin perfil seleccionado
- Diseño responsive y coherente con la estética actual

Resultado esperado:
- El usuario sabe siempre con qué perfil está interactuando

---

### 5. Bloqueo de accesos sin token

**Objetivo:** reforzar la seguridad de la aplicación.

Tareas:
- Revisar componentes que hagan peticiones al backend
- Añadir interceptor o wrapper para peticiones HTTP
- Manejar respuestas 401 / 403
- Invalidar sesión automáticamente ante errores de autenticación
- Evitar estados inconsistentes en frontend

Resultado esperado:
- La app no permite estados “medio autenticados”
- Sesión siempre coherente con el backend

---

### 6. Protección de recursos privados (imágenes y rutas)

**Objetivo:** evitar accesos directos no autorizados.

Tareas:
- Revisar endpoints de imágenes de perfil
- Proteger rutas de recursos en backend con `authMiddleware`
- Evitar acceso directo a ficheros sin token
- Ajustar frontend para enviar token en peticiones de recursos
- Manejar errores de carga de recursos protegidos

Resultado esperado:
- Ningún recurso privado accesible sin autenticación
- Cumplimiento básico de seguridad y privacidad

---

### Resultado final de la Fase 1

- Aplicación estable y segura
- Sesión coherente en frontend y backend
- Contexto claro de perfil activo
- Base sólida para funcionalidades sociales posteriores
