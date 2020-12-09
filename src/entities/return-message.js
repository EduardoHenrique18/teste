module.exports = class ReturnMessage {
  constructor (message, statusCode, data) {
    this.message = message
    this.statusCode = statusCode
    this.data = data
  }
}
