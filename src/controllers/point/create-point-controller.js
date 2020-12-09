const CreatePointUseCase = require('../../use-cases/point/create-point-usecase')
const CreatePointRepository = require('../../Infra/Sql/Repositories/Point/create-point-repository')
const ReadPointRepository = require('../../Infra/Sql/Repositories/Point/read-point-repository')
const PointValidator = require('../../utils/validators/point-validator')

module.exports = class CreatePointController {
  constructor () {
    this.createPointRepository = new CreatePointRepository()
    this.readPointRepository = new ReadPointRepository()
    this.pointValidator = new PointValidator()
    this.createPointUseCase = new CreatePointUseCase(this.createPointRepository, this.readPointRepository, this.pointValidator)
  }

  async CreatePoint (request, response) {
    const returnMessage = await this.createPointUseCase.CreatePoint(request.body)
    response.status(returnMessage.statusCode).send(returnMessage)
  }
}
