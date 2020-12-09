const UpdatePointUseCase = require('../update-point-usecase')
const { InvalidParamError } = require('../../../utils/errors')
const HttpResponse = require('../../../utils/http-response')

const makeSut = () => {
  const pointValidatorSpy = makePointValidator()
  const updatePointRepositorySpy = makeUpdatePointRepositorySpy()
  const sut = new UpdatePointUseCase(
    updatePointRepositorySpy,
    pointValidatorSpy
  )
  return {
    sut,
    updatePointRepositorySpy,
    pointValidatorSpy
  }
}

const makePointValidator = () => {
  class PointValidatorSpy {
    UpdatePointValidator (Point) {
      this.point = Point
      if (this.point.name.length < 5) {
        throw new InvalidParamError('name')
      }
    }
  }
  const pointValidatorSpy = new PointValidatorSpy()
  return pointValidatorSpy
}

const makePointValidatorWithError = () => {
  class PointValidatorSpy {
    updatePointValidatorSpy () {
      throw new Error()
    }
  }
  return new PointValidatorSpy()
}

const makeUpdatePointRepositorySpy = () => {
  class UpdatePointByEmailRepositorySpy {
    async UpdatePoint (Point) {
      this.point = Point
      this.point.pointId = '1'
      return this.point
    }
  }
  const updatePointByEmailRepositorySpy = new UpdatePointByEmailRepositorySpy()
  return updatePointByEmailRepositorySpy
}

const makeUpdatePointRepositorySpyWithError = () => {
  class UpdatePointByEmailRepositorySpy {
    async UpdatePoint () {
      throw new Error()
    }
  }
  const updatePointByEmailRepositorySpy = new UpdatePointByEmailRepositorySpy()
  return updatePointByEmailRepositorySpy
}

describe('Update Point UseCase', () => {
  test('Should return 500 if no pointParam is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.UpdatePoint()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.message).toBe(HttpResponse.ServerError().message)
  })

  test('Should return 500 if pointParam has no body', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.UpdatePoint({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.message).toBe(HttpResponse.ServerError().message)
  })

  test('Should call PointValidator with correct params', async () => {
    const { sut, pointValidatorSpy } = makeSut()
    const httpRequest = {
      name: 'any_name',
      latitude: 'any_latitude',
      longitude: 'any_longitude',
      description: 'any_description',
      userId: '1',
      image: 'base64:aisdãosl,kd2121e2w9392jf',
      pointId: '1'
    }
    await sut.UpdatePoint(httpRequest)
    expect(pointValidatorSpy.point.name).toBe(httpRequest.name)
  })

  test('Should call updatePointRepository with correct params', async () => {
    const { updatePointRepositorySpy, sut } = makeSut()
    const httpRequest = {
      name: 'any_name',
      latitude: 'any_latitude',
      longitude: 'any_longitude',
      description: 'any_description',
      userId: '1',
      image: 'base64:aisdãosl,kd2121e2w9392jf',
      pointId: '1'
    }
    await sut.UpdatePoint(httpRequest)
    expect(updatePointRepositorySpy.point.name).toBe(httpRequest.name)
  })

  test('Should throw if any dependency throws', async () => {
    const updatePointRepositorySpy = makeUpdatePointRepositorySpy()
    const pointValidatorSpy = makePointValidator()
    const suts = [].concat(
      new UpdatePointUseCase({
        updatePointRepositorySpy: makeUpdatePointRepositorySpyWithError(),
        pointValidatorSpy
      }),
      new UpdatePointUseCase({
        updatePointRepositorySpy,
        pointValidatorSpy: makePointValidatorWithError()
      })
    )
    for (const sut of suts) {
      const httpRequest = {
        name: 'any_name',
        latitude: 'any_latitude',
        longitude: 'any_longitude',
        description: 'any_description',
        userId: '1',
        image: 'base64:aisdãosl,kd2121e2w9392jf',
        pointId: '1'
      }
      const httpResponse = await sut.UpdatePoint(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.message).toBe(HttpResponse.ServerError().message)
    }
  })

  test('Should return 400 if an invalid point is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      name: 'name',
      latitude: 'any_latitude',
      longitude: 'any_longitude',
      description: 'any_description',
      userId: '1',
      image: 'base64:aisdãosl,kd2121e2w9392jf',
      pointId: '1'
    }
    const httpResponse = await sut.UpdatePoint(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.message).toBe(new InvalidParamError('name').message)
  })

  test('Should return 200 if point was updated with sucess', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      name: 'any_name',
      latitude: 'any_latitude',
      longitude: 'any_longitude',
      description: 'any_description',
      userId: '1',
      image: 'base64:aisdãosl,kd2121e2w9392jf',
      pointId: '1'
    }

    const httpResponse = await sut.UpdatePoint(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.message).toBe('Successfully')
    expect(httpResponse.data).toEqual(httpRequest)
  })
})
