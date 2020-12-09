module.exports = class DataAlreadyExistError extends Error {
  constructor () {
    super('Data Already Exist')
    this.name = 'DataAlreadyExist'
  }
}
