const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express')

const routes = require('./Routes');

const app = express();

const swaggerDocument = require('../swagger.json')

app.use(cors());

var port = process.env.PORT || 8080;
uri = process.env.ATLAS_URI || '';

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }).catch(err => console.log(err));

app.use(express.json({ limit: '50mb' }));

app.use('/apiDocs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(routes);

app.listen(port);
