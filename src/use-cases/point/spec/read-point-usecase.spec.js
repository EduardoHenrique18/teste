const ReadAllPointUseCase = require('../readAll-point-usecase')
const HttpResponse = require('../../../utils/http-response')

const makeSut = () => {
  const readAllPointRepository = makeReadAllPointRepository()
  const sut = new ReadAllPointUseCase(
    readAllPointRepository
  )
  return {
    sut,
    readAllPointRepository
  }
}

const makeReadAllPointRepository = () => {
  class ReadAllPointRepository {
    async ReadAllPoint () {
      const points = [
        {
          name: 'point1'
        },
        {
          name: 'point2'
        }
      ]
      return points
    }
  }
  const readAllPointRepository = new ReadAllPointRepository()
  return readAllPointRepository
}

const makeReadPointRepositoryWithError = () => {
  class ReadAllPointRepository {
    async ReadAllPoint () {
      throw new Error()
    }
  }
  const readAllPointRepository = new ReadAllPointRepository()
  return readAllPointRepository
}

describe('Read Point UseCase', () => {
  test('Should throw if any dependency throws', async () => {
    const suts = [].concat(
      new ReadAllPointUseCase({
        deletePointRepositorySpy: makeReadPointRepositoryWithError()
      })
    )
    for (const sut of suts) {
      const httpResponse = await sut.ReadAllPoint()
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.message).toBe(HttpResponse.ServerError().message)
    }
  })

  test('Should return 200 if point was deleted with sucess', async () => {
    const { sut } = makeSut()
    const points = [
      {
        name: 'point1'
      },
      {
        name: 'point2'
      }
    ]

    const httpResponse = await sut.ReadAllPoint()
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.message).toBe('Successfully')
    expect(httpResponse.data).toEqual(points)
  })
})
