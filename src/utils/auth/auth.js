const jwt = require('jsonwebtoken')

const auth = (request, response, next) => {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    response.status(401).send({ message: 'No token provided' })
  }

  const parts = authHeader.split(' ')

  if (!parts.length === 2) {
    response.status(401).send({ message: 'Token malformatted' })
  }

  const [scheme, token] = parts

  if (!/^Bearer$/i.test(scheme)) {
    response.status(401).send({ message: 'Token malformatted' })
  }

  jwt.verify(token, process.env.TOKEN || '', (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        response.status(401).send({ message: 'Token expired' })
      }
      response.status(401).send({ message: 'Invalid Token' })
    }
    request.body.userId = decoded.id
    return next()
  })
}

module.exports = auth
