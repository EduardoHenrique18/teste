module.exports = class IncorrectUserError extends Error {
  constructor () {
    super('Name or Password is incorrect')
    this.name = 'IncorrectUserError'
  }
}
