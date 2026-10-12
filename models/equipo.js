let mongoose = require('mongoose')
let Schema = mongoose.Schema

let EquipoSchema = Schema({
  nombre: { type: String, required: true},
  capitan: String,
  contacto: String,
  activo: { type: Boolean, default: true}
})

module.exports = mongoose.model('Equipo', EquipoSchema, 'equipos')