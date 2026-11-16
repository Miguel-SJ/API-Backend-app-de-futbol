# API REST - Gestión de equipos e inhabilitaciones de fútbol

Backend desarrollado con **Node.js**, **Express** y **Mongodb atlas** para gestionar plantillas, partidos, alineaciones y control de sanciones disciplinarias o lesiones, consumido por la aplicación móvil nativa en Android

---

## Despliegue en la Nube

La api se encuentra desplegada y operativa en producción utilizando **Render** y **Mongodb atlas**

---

## Endpoints principales

| Recurso | Método | Ruta | Descripción |
| :--- | :--- | :--- | :--- |
| **Equipos** | `GET` / `POST` | `/api/equipo` | Consultar y registrar equipos |
| **Jugadores** | `GET` | `/api/jugador` | Listar plantilla (soporta filtro `?status=unavailable`) |
| **Jugadores** | `POST` | `/api/jugador/guardar-jugador` | Registrar un nuevo jugador |
| **Jugadores** | `PUT` / `DELETE` | `/api/jugador/:id` | Editar o eliminar un jugador |
| **Inhabilitaciones** | `POST` | `/api/inhabilitacion/guardar-inhabilitacion` | Registrar sanción o lesión activa |
| **Inhabilitaciones** | `PATCH` | `/api/inhabilitacion/resolver-inhabilitacion/:id` | Marcar sanción como cumplida |
| **Partidos** | `GET` / `POST` | `/api/partido` | Consultar y agendar jornadas |
| **Alineaciones** | `POST` | `/api/partido/alineacion/:id` | Guardar titulares (retorna `409 Conflict` si hay sancionados) |
