const ReadAllPointUseCase = require('../../use-cases/point/readAll-point-usecase')
const ReadAllPointRepository = require('../../Infra/Sql/Repositories/Point/read-point-repository')

module.exports = class ReadAllPointController {
  constructor () {
    this.readAllPointRepository = new ReadAllPointRepository()
    this.readAllPointUseCase = new ReadAllPointUseCase(this.readAllPointRepository)
  }

  async ReadAllPoint (request, response) {
    const returnMessage = await this.readAllPointUseCase.ReadAllPoint(request.body)
    response.status(returnMessage.statusCode).send(returnMessage)
  }
}
