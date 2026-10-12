let mongoose = require('mongoose')
let Schema = mongoose.Schema

let PartidoSchema = Schema({
  equipoLocal: { type: Schema.Types.ObjectId, ref: 'Equipo', required: true},
  equipoVisitante: { type: Schema.Types.ObjectId, ref: 'Equipo', required: true},
  fechaPartido: Date,
  lugar: String,
  alineacionLocal: [{ type: Schema.Types.ObjectId, ref: 'Jugador'}],
  alineacionVisitante: [{ type: Schema.Types.ObjectId, ref: 'Jugador'}]
})

module.exports = mongoose.model('Partido', PartidoSchema, 'partidos')