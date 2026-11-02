let mongoose = require('mongoose')
const app = require('./app')

mongoose.Promise = global.Promise

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/futchiboldb'

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Base de datos conectada correctamente')

    app.listen(app.get('port'), () => {
      console.log(`Servidor corriendo en el puerto ${app.get('port')}`)
    })
  })
  .catch(err => console.error('Error al conectar la base de datos:', err))
