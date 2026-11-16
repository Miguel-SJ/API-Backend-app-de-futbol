const { Router } = require('express')
const PartidoController = require('../controllers/partido')

const router = Router()

router.get('/', PartidoController.getPartidos)
router.get('/:id', PartidoController.getPartido)
router.post('/guardar-partido', PartidoController.savePartido)
router.post('/alineacion/:id', PartidoController.saveAlineacion)
router.delete('/eliminar-partido/:id', PartidoController.deletePartido)

module.exports = router
