let Inhabilitacion = require('../models/inhabilitacion')
let Jugador = require('../models/jugador')

const controller = {
  getInhabilitaciones: function (req, res){
    Inhabilitacion.find({}).populate('jugador', 'nombre dorsal').exec()
      .then(list => {
        if (!list || list.length === 0) return res.status(404).send({ message: "No hay inhabilitaciones"})
        return res.status(200).json(list)
      })
      .catch(err => res.status(500).send({ message: `Error: ${err}`}))
  },

  saveInhabilitacion: async function (req, res){
    const { jugador, motivo, descripcion, fechaFin } = req.body

    if (!jugador || !motivo) return res.status(400).send({ message: "Jugador y motivo son obligatorios"})

    try {
      if (!(await Jugador.exists({ _id: jugador }))) {
        return res.status(404).send({ message: "El jugador no existe"})
      }
      const stored = await new Inhabilitacion({ jugador, motivo, descripcion, fechaFin }).save()
      return res.status(201).json({ inhabilitacion: stored })
    } catch (err) {
      return res.status(500).send({ message: "Error al guardar"})
    }
  },

  resolveInhabilitacion: function (req, res){
    let id = req.params.id

    Inhabilitacion.findByIdAndUpdate(id, { resuelta: true }, { returnDocument: 'after'})
      .then(updated => {
        if (!updated) return res.status(404).send({ message: "No existe la inhabilitación"})
        return res.status(200).send({ inhabilitacion: updated })
      })
      .catch(err => res.status(500).send({ message: "Error al actualizar estado"}))
  }
}

module.exports = controller