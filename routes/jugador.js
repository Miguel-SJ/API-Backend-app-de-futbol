const { Router } = require('express')
const JugadorController = require('../controllers/jugador')

const router = Router()

router.get('/', JugadorController.getJugadores)
router.get('/:id', JugadorController.getJugador)
router.post('/guardar-jugador', JugadorController.saveJugador)
router.put('/editar-jugador/:id', JugadorController.updateJugador)
router.delete('/eliminar-jugador/:id', JugadorController.deleteJugador)

module.exports = router