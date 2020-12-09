const express = require('express')
const cors = require('cors')
const Routes = require('./Routes')
const swaggerUi = require('swagger-ui-express')
const mongoose = require('mongoose')

const swaggerDocument = require('../../../swagger.json')

class App {
  constructor () {
    this.express = express()

    this.dataBase()
    this.middlewares()
    this.swagger()
    this.routes()
  }

  dataBase () {
    const uri = process.env.ATLAS_URI || ''
    mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }).catch(err => console.log(err))
  }

  swagger () {
    this.express.use('/apiDocs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  }

  middlewares () {
    this.express.use(express.json({ limit: '50mb' }))
    this.express.use(cors())
  }

  routes () {
    this.express.use(Routes)
  }
}

module.exports = new App().express
