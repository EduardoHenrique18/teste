module.exports = class ServerError extends Error {
  constructor () {
    super('An internal error')
    this.name = 'ServerError'
    this.statusCode = 500
  }
}
