const Point = require('../../entities/Point')
const InvalidParamError = require('../../utils/errors/invalid-param-error')
const HttpResponse = require('../../utils/http-response')

module.exports = class CreatePointUseCase {
  constructor (createPointRepository, readPointRepository, pointValidator) {
    this.createPointRepository = createPointRepository
    this.pointValidator = pointValidator
    this.readPointRepository = readPointRepository
    this.httpResponse = HttpResponse
  }

  async CreatePoint (pointParam) {
    try {
      const { name, latitude, longitude, description, image, userId, disable } = pointParam

      const point = new Point(name, latitude, longitude, description, userId, image, '', disable)

      this.pointValidator.CreatePointValidator(point)

      const pointAlreadyExist = await this.readPointRepository.ReadPointByLongAndLat(point)

      if (pointAlreadyExist) {
        return this.httpResponse.conflictError('Point Already Exist')
      }
      const createdPoint = await this.createPointRepository.CreatePoint(point)

      return this.httpResponse.Ok(createdPoint)
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
