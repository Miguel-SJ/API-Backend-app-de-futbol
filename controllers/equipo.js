let Equipo = require('../models/equipo')

const controller = {
  getEquipos: function (req, res){
    Equipo.find({}).exec()
      .then(equipos => {
        if (!equipos || equipos.length === 0){
          return res.status(404).send({ message: "No se encontraron equipos"})
        }
        return res.status(200).json(equipos)
      })
      .catch(err => res.status(500).send({ message: `Error en la consulta: ${err}`}))
  },

  saveEquipo: function (req, res){
    let equipo = new Equipo()
    const { nombre, capitan, contacto } = req.body

    if (nombre) {
      equipo.nombre = nombre
      equipo.capitan = capitan
      equipo.contacto = contacto

      equipo.save()
        .then(stored => {
          stored
            ? res.status(201).json({ equipo: stored })
            : res.status(404).send({ message: "No se pudo guardar el equipo"})
        })
        .catch(err => res.status(500).send({ message: "Error al guardar el equipo"}))
    } else {
      return res.status(400).send({ message: "El nombre del equipo es obligatorio"})
    }
  }
}

module.exports = controller