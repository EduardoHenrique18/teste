const jwt = require('jsonwebtoken')
require('dotenv/config')

class TokenGenerator {
  generate (userId) {
    return jwt.sign({ id: userId }, process.env.TOKEN || '', {
      expiresIn: 10800
    })
  }
}

module.exports = TokenGenerator
