let Inhabilitacion = require('../models/inhabilitacion')

const controller = {
  getInhabilitaciones: function (req, res){
    Inhabilitacion.find({}).populate('jugador', 'nombre dorsal').exec()
      .then(list => {
        if (!list || list.length === 0) return res.status(404).send({ message: "No hay inhabilitaciones"})
        return res.status(200).json(list)
      })
      .catch(err => res.status(500).send({ message: `Error: ${err}`}))
  },

  saveInhabilitacion: function (req, res){
    let inh = new Inhabilitacion()
    const { jugador, motivo, descripcion, fechaFin } = req.body

    if (jugador && motivo){
      inh.jugador = jugador
      inh.motivo = motivo
      inh.descripcion = descripcion
      inh.fechaFin = fechaFin

      inh.save()
        .then(stored => {
          stored
            ? res.status(201).json({ inhabilitacion: stored })
            : res.status(404).send({ message: "No se pudo registrar"})
        })
        .catch(err => res.status(500).send({ message: "Error al guardar"}))
    } else{
      return res.status(400).send({ message: "Jugador y motivo son obligatorios"})
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