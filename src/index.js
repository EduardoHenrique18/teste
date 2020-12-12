const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const routes = require('./Routes');

const app = express();

app.use(cors());

var uri = process.env.ATLAS_URI||'mongodb://edu:1123581321@cluster0-shard-00-00.ubafb.mongodb.net:27017,cluster0-shard-00-01.ubafb.mongodb.net:27017,cluster0-shard-00-02.ubafb.mongodb.net:27017/test?ssl=true&replicaSet=atlas-fwpg8v-shard-0&authSource=admin&retryWrites=true&w=majority'
var PORT = process.env.PORT||'8080'

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }).catch(err => console.log(err));

app.use(express.json({ limit: '50mb' }));

app.use(routes);

app.listen(PORT, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
