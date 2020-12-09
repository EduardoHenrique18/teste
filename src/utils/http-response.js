const ReturnMessage = require('../entities/return-message')

module.exports = class HttpResponse {
  static InvalidParamError (message) {
    return new ReturnMessage(message, 400)
  }

  static ServerError () {
    return new ReturnMessage('Server Error', 500)
  }

  static Ok (data) {
    return new ReturnMessage('Successfully', 200, data)
  }

  static Generic (message, code, data) {
    return new ReturnMessage(message, code, data)
  }

  static conflictError (message) {
    return new ReturnMessage(message, 409)
  }

  static unauthorizedError () {
    return new ReturnMessage('unauthorizedError', 401)
  }
}
