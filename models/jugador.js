let mongoose = require('mongoose')
let Schema = mongoose.Schema

let JugadorSchema = Schema({
  nombre: { type: String, required: true},
  dorsal: Number,
  posicion: String,
  equipo: { type: Schema.Types.ObjectId, ref: 'Equipo', required: true},
  activo: { type: Boolean, default: true}
})

module.exports = mongoose.model('Jugador', JugadorSchema, 'jugadores')