const { Router } = require('express')
const PartidoController = require('../controllers/partido')

const router = Router()

router.post('/guardar-partido', PartidoController.savePartido)
router.post('/alineacion/:id', PartidoController.saveAlineacion)

module.exports = router