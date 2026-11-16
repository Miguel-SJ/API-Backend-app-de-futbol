Requisitos previos

Descargar:
* [Node.js](https://nodejs.org/) (versión 18 o superior)
* [MongoDB](https://www.mongodb.com/try/download/community) en el puerto 27017
* Un cliente http como **Thunder Client** o **Postman**

## Instalación y Configuración

1. Abrir el proyecto
En visual ir al archivo, abrir carpeta y seleccionar la carpeta del proyecto

2. Abrir la terminal
Abrir con ctrl + ~ o desde el menú superior Terminal, nueva terminal

3. Instalar las dependencias
Ejecutar el siguiente comando en la terminal

npm install

## Inicializar la BD

Abrir la terminal de MongoDB y ejecutar el siguiente script

use futboldb

const equipoLocal = db.equipos.insertOne({
  nombre: "Atletico desempleados",
  capitan: "Miguel Sandoval",
  contacto: "3001234567",
  activo: true
});

const equipoVisitante = db.equipos.insertOne({
  nombre: "Deportivo smash",
  capitan: "Brayan Banguero",
  contacto: "3104655443",
  activo: true
});

const jugador1 = db.jugadores.insertOne({
  nombre: "Santiago Tavella Valencia",
  dorsal: 10,
  posicion: "Delantero",
  equipo: equipoLocal.insertedId,
  activo: true
});

const jugador2 = db.jugadores.insertOne({
  nombre: "Mateo Venega",
  dorsal: 5,
  posicion: "Defensa",
  equipo: equipoLocal.insertedId,
  activo: true
});

const jugador3 = db.jugadores.insertOne({
  nombre: "Diego Munoz",
  dorsal: 8,
  posicion: "Mediocampista",
  equipo: equipoVisitante.insertedId,
  activo: true
});

db.inhabilitaciones.insertOne({
  jugador: jugador2.insertedId,
  motivo: "tarjeta_roja",
  descripcion: "Expulsión en la jornada 1",
  fechaInicio: new Date(),
  resuelta: false
});

db.partidos.insertOne({
  equipoLocal: equipoLocal.insertedId,
  equipoVisitante: equipoVisitante.insertedId,
  fechaPartido: new Date(),
  lugar: "Cancha de la Uniautónoma",
  alineacionLocal: [],
  alineacionVisitante: []
});

## Ejecución del server

En la terminal del visual ejecutar:

node index.js

Si todo se configuró correctamente, saldran en la consola los siguientes mensajes:

Base de datos conectada correctamente
Servidor corriendo en http://localhost:3000
