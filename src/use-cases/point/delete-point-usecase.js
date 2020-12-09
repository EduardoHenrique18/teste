const HttpResponse = require('../../utils/http-response')

module.exports = class DeletePointUseCase {
  constructor (deletePointRepository) {
    this.deletePointRepository = deletePointRepository
    this.httpResponse = HttpResponse
  }

  async DeletePoint (pointParam) {
    try {
      const deletePoint = await this.deletePointRepository.DeletePoint(pointParam)

      return this.httpResponse.Ok(deletePoint)
    } catch (error) {
      console.log(error)
      return this.httpResponse.ServerError()
    }
  }
}
