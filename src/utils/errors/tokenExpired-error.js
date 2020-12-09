module.exports = class TokenExpiredError extends Error {
  constructor () {
    super('The token is expired')
    this.name = 'TokenExpiredError'
  }
}
