let mongoose = require('mongoose')
const app = require('./app')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://127.0.0.1:27017/futchiboldb')
  .then(() => {
    console.log('Base de datos conectada correctamente')

    app.listen(app.get('port'), () => {
      console.log(`Servidor corriendo en http://localhost:${app.get('port')}`)
    })
  })
  .catch(err => console.error(err))