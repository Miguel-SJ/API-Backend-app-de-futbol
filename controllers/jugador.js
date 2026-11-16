let Jugador = require('../models/jugador')
let Equipo = require('../models/equipo')
let Inhabilitacion = require('../models/inhabilitacion')

const controller = {
  getJugadores: function (req, res){
    let filtro = {}
    const { equipo, status } = req.query

    if (equipo) filtro.equipo = equipo

    if (status === 'unavailable') {
      Inhabilitacion.find({ resuelta: false }).select('jugador')
        .then(inhabilitaciones => {
          let idsInhabilitados = inhabilitaciones.map(i => i.jugador)
          filtro._id = { $in: idsInhabilitados }
          return Jugador.find(filtro).populate('equipo', 'nombre').exec()
        })
        .then(jugadoresList => {
          if (!jugadoresList || jugadoresList.length === 0) {
            return res.status(404).send({ message: "No se encontraron jugadores inhabilitados"})
          }
          return res.status(200).json(jugadoresList)
        })
        .catch(err => res.status(500).send({ message: `Error en la consulta: ${err}`}))
    } else {
      Jugador.find(filtro).populate('equipo', 'nombre').exec()
        .then(jugadoresList => {
          if (!jugadoresList || jugadoresList.length === 0) {
            return res.status(404).send({ message: "No se encontraron jugadores"})
          }
          return res.status(200).json(jugadoresList)
        })
        .catch(err => res.status(500).send({ message: `Error en la consulta: ${err}`}))
    }
  },

  getJugador: function (req, res){
    let jugadorId = req.params.id
    if (!jugadorId) return res.status(404).send({ message: "El jugador no existe"})

    Jugador.findById(jugadorId).populate('equipo', 'nombre').exec()
      .then(data => {
        if (!data) return res.status(404).send({ message: "No se encontró el jugador"})
        return res.status(200).json(data)
      })
      .catch(err => res.status(500).send({ message: `Error interno: ${err}`}))
  },

  saveJugador: async function (req, res){
    const { nombre, dorsal, posicion, equipo } = req.body

    if (!nombre || !equipo) return res.status(400).send({ message: "Nombre y equipo son obligatorios"})

    try {
      if (!(await Equipo.exists({ _id: equipo }))) {
        return res.status(404).send({ message: "El equipo no existe"})
      }
      if (dorsal !== undefined && dorsal !== null) {
        const repetido = await Jugador.findOne({ equipo, dorsal })
        if (repetido) {
          return res.status(409).send({ message: `El dorsal ${dorsal} ya lo usa ${repetido.nombre} en este equipo`})
        }
      }
      const stored = await new Jugador({ nombre, dorsal, posicion, equipo }).save()
      return res.status(201).json({ jugador: stored })
    } catch (err) {
      return res.status(500).send({ message: "Error al guardar el jugador"})
    }
  },

  updateJugador: function (req, res){
    let jugadorId = req.params.id
    const { nombre, dorsal, posicion, equipo, activo } = req.body
    let update = Object.fromEntries(Object.entries({ nombre, dorsal, posicion, equipo, activo }).filter(([, v]) => v !== undefined))

    Jugador.findByIdAndUpdate(jugadorId, update, { returnDocument: 'after'})
      .then(updatedJugador => {
        if (!updatedJugador) return res.status(404).send({ message: "El jugador no existe para actualizar"})
        return res.status(200).send({ jugador: updatedJugador})
      })
      .catch(error => res.status(500).send({ message: `Error al actualizar: ${error}`}))
  },

  deleteJugador: function (req, res){
    let jugadorId = req.params.id

    Jugador.findByIdAndDelete(jugadorId)
      .then(async removedJugador => {
        if (!removedJugador) return res.status(404).send({ message: "El jugador no existe"})
        // Evita sanciones huérfanas: las activas del jugador eliminado quedan resueltas
        await Inhabilitacion.updateMany({ jugador: jugadorId, resuelta: false }, { resuelta: true })
        return res.status(200).send({ jugador: removedJugador })
      })
      .catch(err => res.status(500).send({ message: "Error al eliminar el jugador"}))
  }
}

module.exports = controller