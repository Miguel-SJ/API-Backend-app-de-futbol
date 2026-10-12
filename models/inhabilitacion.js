let mongoose = require('mongoose')
let Schema = mongoose.Schema

let InhabilitacionSchema = Schema({
  jugador: { type: Schema.Types.ObjectId, ref: 'Jugador', required: true},
  motivo: { type: String, required: true},
  descripcion: String,
  fechaInicio: { type: Date, default: Date.now},
  fechaFin: Date,
  resuelta: { type: Boolean, default: false}
})

module.exports = mongoose.model('Inhabilitacion', InhabilitacionSchema, 'inhabilitaciones')