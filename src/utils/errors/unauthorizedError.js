module.exports = class unauthorizedError extends Error {
  constructor (message) {
    super(message)
    this.name = 'UnauthorizedError'
    this.statusCode = 401
  }
}
