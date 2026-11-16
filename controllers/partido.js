const mongoose = require('mongoose')
let Partido = require('../models/partido')
let Equipo = require('../models/equipo')
let Jugador = require('../models/jugador')
let Inhabilitacion = require('../models/inhabilitacion')

const esId = (id) => mongoose.isValidObjectId(id)
const populateEquipos = (q) => q.populate('equipoLocal', 'nombre').populate('equipoVisitante', 'nombre')

const controller = {
  // GET /api/partido            -> todos los partidos
  // GET /api/partido?equipo=ID  -> partidos donde juega ese equipo (local o visitante)
  getPartidos: function (req, res){
    const { equipo } = req.query
    if (equipo && !esId(equipo)) return res.status(400).send({ message: "Id de equipo no válido"})

    const filtro = equipo ? { $or: [{ equipoLocal: equipo }, { equipoVisitante: equipo }] } : {}

    populateEquipos(Partido.find(filtro)).sort({ fechaPartido: 1 }).exec()
      .then(list => res.status(200).json(list))
      .catch(err => res.status(500).send({ message: `Error en la consulta: ${err}`}))
  },

  getPartido: function (req, res){
    if (!esId(req.params.id)) return res.status(400).send({ message: "Id de partido no válido"})

    populateEquipos(Partido.findById(req.params.id)).exec()
      .then(partido => {
        if (!partido) return res.status(404).send({ message: "No se encontró el partido"})
        return res.status(200).json(partido)
      })
      .catch(err => res.status(500).send({ message: `Error interno: ${err}`}))
  },

  savePartido: async function (req, res){
    try {
      const { equipoLocal, equipoVisitante, fechaPartido, lugar } = req.body

      if (!equipoLocal || !equipoVisitante) {
        return res.status(400).send({ message: "Ambos equipos son obligatorios"})
      }
      if (!esId(equipoLocal) || !esId(equipoVisitante)) {
        return res.status(400).send({ message: "Id de equipo no válido"})
      }
      if (String(equipoLocal) === String(equipoVisitante)) {
        return res.status(400).send({ message: "El equipo local y el visitante deben ser distintos"})
      }
      const existentes = await Equipo.countDocuments({ _id: { $in: [equipoLocal, equipoVisitante] } })
      if (existentes !== 2) return res.status(404).send({ message: "Alguno de los equipos no existe"})

      const partido = await new Partido({ equipoLocal, equipoVisitante, fechaPartido, lugar }).save()
      return res.status(201).json({ partido })
    } catch (err) {
      return res.status(500).send({ message: "Error al crear el partido"})
    }
  },

  deletePartido: function (req, res){
    if (!esId(req.params.id)) return res.status(400).send({ message: "Id de partido no válido"})

    Partido.findByIdAndDelete(req.params.id)
      .then(removed => {
        if (!removed) return res.status(404).send({ message: "El partido no existe"})
        return res.status(200).send({ partido: removed })
      })
      .catch(err => res.status(500).send({ message: "Error al eliminar el partido"}))
  },

  // REGLA DE NEGOCIO: una alineación solo admite jugadores del equipo de ese lado y sin inhabilitación activa
  saveAlineacion: async function (req, res){
    try {
      const { tipoEquipo, jugadoresIds } = req.body

      if (tipoEquipo !== 'local' && tipoEquipo !== 'visitante') {
        return res.status(400).send({ message: "tipoEquipo debe ser 'local' o 'visitante'"})
      }
      if (!Array.isArray(jugadoresIds) || !jugadoresIds.every(esId)) {
        return res.status(400).send({ message: "jugadoresIds debe ser una lista de ids válidos"})
      }
      if (!esId(req.params.id)) return res.status(400).send({ message: "Id de partido no válido"})

      const partido = await Partido.findById(req.params.id)
      if (!partido) return res.status(404).send({ message: "No se encontró el partido"})

      const ids = [...new Set(jugadoresIds.map(String))]
      const equipoId = String(tipoEquipo === 'local' ? partido.equipoLocal : partido.equipoVisitante)

      const jugadores = await Jugador.find({ _id: { $in: ids } }).select('nombre dorsal equipo')
      if (jugadores.length !== ids.length) {
        return res.status(400).send({ message: "Alguno de los jugadores no existe"})
      }
      const ajenos = jugadores.filter(j => String(j.equipo) !== equipoId)
      if (ajenos.length > 0) {
        return res.status(400).send({
          message: `Jugadores que no pertenecen al equipo ${tipoEquipo} de este partido: ${ajenos.map(j => j.nombre).join(', ')}`
        })
      }

      const inhabilitados = await Inhabilitacion.find({ jugador: { $in: ids }, resuelta: false })
        .populate('jugador', 'nombre dorsal')
      if (inhabilitados.length > 0) {
        const nombres = [...new Set(inhabilitados.map(i => `${i.jugador.nombre} (Dorsal #${i.jugador.dorsal})`))].join(', ')
        return res.status(409).send({
          error: "REGLA_DE_NEGOCIO_VIOLADA",
          message: `No se puede guardar la alineacion, jugadores inhabilitados: ${nombres}`
        })
      }

      partido[tipoEquipo === 'local' ? 'alineacionLocal' : 'alineacionVisitante'] = ids
      const actualizado = await partido.save()
      return res.status(200).send({ message: "Alineacion registrada exitosamente", partido: actualizado })
    } catch (err) {
      return res.status(500).send({ message: `Error procesando alineacion: ${err}`})
    }
  }
}

module.exports = controller
