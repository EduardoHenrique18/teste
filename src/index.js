const App = require('./infra/express/app')

var port = process.env.PORT || 8080

App.listen(port)
