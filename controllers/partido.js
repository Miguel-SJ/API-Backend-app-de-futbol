let Partido = require('../models/partido')
let Inhabilitacion = require('../models/inhabilitacion')

const controller = {
  savePartido: function (req, res){
    let partido = new Partido()
    const { equipoLocal, equipoVisitante, fechaPartido, lugar } = req.body

    if (equipoLocal && equipoVisitante) {
      partido.equipoLocal = equipoLocal
      partido.equipoVisitante = equipoVisitante
      partido.fechaPartido = fechaPartido
      partido.lugar = lugar

      partido.save()
        .then(stored => res.status(201).json({ partido: stored}))
        .catch(err => res.status(500).send({ message: "Error al crear el partido"}))
    } else {
      return res.status(400).send({ message: "Ambos equipos son obligatorios"})
    }
  },

  // REGLA DE NEGOCIO: Validar alineación
  saveAlineacion: function (req, res){
    let partidoId = req.params.id
    const { tipoEquipo, jugadoresIds } = req.body

    Inhabilitacion.find({ jugador: { $in: jugadoresIds }, resuelta: false }).populate('jugador', 'nombre dorsal').exec()
      .then(inhabilitados => {
        if (inhabilitados && inhabilitados.length > 0) {
          let nombres = inhabilitados.map(i => `${i.jugador.nombre} (Dorsal #${i.jugador.dorsal})`).join(', ')
          return res.status(409).send({
            error: "REGLA_DE_NEGOCIO_VIOLADA",
            message: `No se puede guardar la alineacion, jugadores inhabilitados: ${nombres}`
          })
        }

        let campoAlineacion = tipoEquipo === 'local' ? 'alineacionLocal' : 'alineacionVisitante'
        let update = {}
        update[campoAlineacion] = jugadoresIds

        return Partido.findByIdAndUpdate(partidoId, update, { returnDocument: 'after'})
      })
      .then(partidoActualizado => {
        if (!partidoActualizado) return
        if (res.headersSent) return

        return res.status(200).send({
          message: "Alineacion registrada exitosamente",
          partido: partidoActualizado
        })
      })
      .catch(err => {
        if (!res.headersSent){
          res.status(500).send({ message: `Error procesando alineacion: ${err}`})
        }
      })
  }
}

module.exports = controller