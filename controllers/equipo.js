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

  saveEquipo: async function (req, res){
    const { capitan, contacto } = req.body
    const nombre = typeof req.body.nombre === 'string' ? req.body.nombre.trim() : ''

    if (!nombre) return res.status(400).send({ message: "El nombre del equipo es obligatorio"})

    try {
      const existe = await Equipo.findOne({ nombre }).collation({ locale: 'es', strength: 1 })
      if (existe) return res.status(409).send({ message: `Ya existe un equipo llamado ${existe.nombre}`})

      const stored = await new Equipo({ nombre, capitan, contacto }).save()
      return res.status(201).json({ equipo: stored })
    } catch (err) {
      return res.status(500).send({ message: "Error al guardar el equipo"})
    }
  }
}

module.exports = controller