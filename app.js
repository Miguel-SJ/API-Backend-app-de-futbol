const express = require('express')
const equipo_routes = require('./routes/equipo')
const jugador_routes = require('./routes/jugador')
const inhabilitacion_routes = require('./routes/inhabilitacion')
const partido_routes = require('./routes/partido')

const app = express()

app.set('port', process.env.PORT || 3000)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/equipo', equipo_routes)
app.use('/api/jugador', jugador_routes)
app.use('/api/inhabilitacion', inhabilitacion_routes)
app.use('/api/partido', partido_routes)

module.exports = app