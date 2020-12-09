const DeletePointUseCase = require('../delete-point-usecase')
const HttpResponse = require('../../../utils/http-response')

const makeSut = () => {
  const deletePointRepositorySpy = makeDeletePointRepository()
  const sut = new DeletePointUseCase(
    deletePointRepositorySpy
  )
  return {
    sut,
    deletePointRepositorySpy
  }
}

const makeDeletePointRepository = () => {
  class DeletePointRepositorySpy {
    async DeletePoint (param) {
      this.pointId = param
      return this.pointId
    }
  }
  const deletePointRepositorySpy = new DeletePointRepositorySpy()
  return deletePointRepositorySpy
}

const makeDeletePointRepositoryWithError = () => {
  class DeletePointRepositorySpy {
    async DeletePoint () {
      throw new Error()
    }
  }
  const deletePointRepositorySpy = new DeletePointRepositorySpy()
  return deletePointRepositorySpy
}

describe('Create Point UseCase', () => {
  test('Should call deletePointRepository with correct params', async () => {
    const { sut, deletePointRepositorySpy } = makeSut()
    const httpRequest = {
      pointId: '1'
    }
    await sut.DeletePoint(httpRequest)
    expect(deletePointRepositorySpy.pointId.pointId).toBe(httpRequest.pointId)
  })

  test('Should throw if any dependency throws', async () => {
    const suts = [].concat(
      new DeletePointUseCase({
        deletePointRepositorySpy: makeDeletePointRepositoryWithError()
      })
    )
    for (const sut of suts) {
      const httpRequest = {
        pointId: '1'
      }
      const httpResponse = await sut.DeletePoint(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.message).toBe(HttpResponse.ServerError().message)
    }
  })

  test('Should return 200 if point was deleted with sucess', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      pointId: '1'
    }

    const httpResponse = await sut.DeletePoint(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.message).toBe('Successfully')
    expect(httpResponse.data.pointId).toEqual(httpRequest.pointId)
  })
})
