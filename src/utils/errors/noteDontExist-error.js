module.exports = class NoteDontExistError extends Error {
  constructor () {
    super('Note dont exist')
    this.name = 'NoteDontExistError'
  }
}
