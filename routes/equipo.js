const { Router } = require('express')
const EquipoController = require('../controllers/equipo')

const router = Router()

router.get('/', EquipoController.getEquipos)
router.post('/guardar-equipo', EquipoController.saveEquipo)

module.exports = router