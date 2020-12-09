const Point = require('../../entities/Point')
const InvalidParamError = require('../../utils/errors/invalid-param-error')
const HttpResponse = require('../../utils/http-response')

module.exports = class UpdatePointUseCase {
  constructor (updatePointRepository, pointValidator) {
    this.updatePointRepository = updatePointRepository
    this.pointValidator = pointValidator
    this.httpResponse = HttpResponse
  }

  async UpdatePoint (pointParam) {
    try {
      const { name, latitude, longitude, description, image, userId, pointId } = pointParam

      const point = new Point(name, latitude, longitude, description, userId, image, pointId)

      this.pointValidator.UpdatePointValidator(point)

      await this.updatePointRepository.UpdatePoint(point)

      return this.httpResponse.Ok({ name, latitude, longitude, description, image, userId, pointId })
    } catch (error) {
      if (error instanceof InvalidParamError) {
        console.log(error)
        return this.httpResponse.InvalidParamError(error.message)
      } else {
        console.log(error)
        return this.httpResponse.ServerError()
      }
    }
  }
}
