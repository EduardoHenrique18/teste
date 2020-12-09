const CreatePointUseCase = require('../create-point-usecase')
const { InvalidParamError } = require('../../../utils/errors')
const HttpResponse = require('../../../utils/http-response')

const makeSut = () => {
  const pointValidatorSpy = makePointValidator()
  const readPointRepositorySpy = makeReadPointByEmailRepository()
  const createPointRepositorySpy = makeCreatePointRepositorySpy()
  const sut = new CreatePointUseCase(
    createPointRepositorySpy,
    readPointRepositorySpy,
    pointValidatorSpy
  )
  return {
    sut,
    readPointRepositorySpy,
    createPointRepositorySpy,
    pointValidatorSpy
  }
}

const makePointValidator = () => {
  class PointValidatorSpy {
    CreatePointValidator (Point) {
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
    createPointValidatorSpy () {
      throw new Error()
    }
  }
  return new PointValidatorSpy()
}

const makeReadPointByEmailRepository = () => {
  class ReadPointByEmailRepositorySpy {
    async ReadPointByLongAndLat (Point) {
      this.point = Point
      if (this.point.useremail === 'AlreadyExist@email.com') {
        return HttpResponse.conflictError('Point Already Exist')
      }
      return this.point
    }
  }
  const readPointByEmailRepositorySpy = new ReadPointByEmailRepositorySpy()
  return readPointByEmailRepositorySpy
}

const makeReadPointByEmailRepositoryPointAlreadyExist = () => {
  class ReadPointByEmailRepositorySpy {
    async ReadPointByLongAndLat (Point) {
      this.point = Point
      return null
    }
  }
  const readPointByEmailRepositorySpy = new ReadPointByEmailRepositorySpy()
  return readPointByEmailRepositorySpy
}

const makeReadPointByEmailRepositoryWithError = () => {
  class ReadPointByEmailRepositorySpy {
    async ReadPointByLongAndLat () {
      throw new Error()
    }
  }
  const readPointByEmailRepositorySpy = new ReadPointByEmailRepositorySpy()
  return readPointByEmailRepositorySpy
}

const makeCreatePointRepositorySpy = () => {
  class CreatePointByEmailRepositorySpy {
    async CreatePoint (Point) {
      this.point = Point
      this.point.pointId = '1'
      return this.point
    }
  }
  const createPointByEmailRepositorySpy = new CreatePointByEmailRepositorySpy()
  return createPointByEmailRepositorySpy
}

const makeCreatePointRepositorySpyWithError = () => {
  class CreatePointByEmailRepositorySpy {
    async CreatePoint () {
      throw new Error()
    }
  }
  const createPointByEmailRepositorySpy = new CreatePointByEmailRepositorySpy()
  return createPointByEmailRepositorySpy
}

describe('Create Point UseCase', () => {
  test('Should return 500 if no pointParam is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.CreatePoint()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.message).toBe(HttpResponse.ServerError().message)
  })

  test('Should return 500 if pointParam has no body', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.CreatePoint({})
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
      useremail: 'anu_email@email.com'
    }
    await sut.CreatePoint(httpRequest)
    expect(pointValidatorSpy.point.name).toBe(httpRequest.name)
  })

  test('Should call readPointByEmailRepository with correct params', async () => {
    const { sut, readPointRepositorySpy } = makeSut()
    const httpRequest = {
      name: 'any_name',
      latitude: 'any_latitude',
      longitude: 'any_longitude',
      description: 'any_description',
      useremail: 'any_email@email.com'
    }
    await sut.CreatePoint(httpRequest)
    expect(readPointRepositorySpy.point.name).toBe(httpRequest.name)
  })

  test('Should call createPointRepository with correct params', async () => {
    const { createPointRepositorySpy, pointValidatorSpy } = makeSut()
    const ReadPointByEmailRepositoryPointAlreadyExist = makeReadPointByEmailRepositoryPointAlreadyExist()
    const sut =
      new CreatePointUseCase(
        createPointRepositorySpy,
        ReadPointByEmailRepositoryPointAlreadyExist,
        pointValidatorSpy
      )
    const httpRequest = {
      name: 'any_name',
      latitude: 'any_latitude',
      longitude: 'any_longitude',
      description: 'any_description',
      useremail: 'any_email@email.com'
    }
    await sut.CreatePoint(httpRequest)
    expect(createPointRepositorySpy.point.name).toBe(httpRequest.name)
  })

  test('Should throw if any dependency throws', async () => {
    const createPointRepositorySpy = makeCreatePointRepositorySpy()
    const readPointByEmailRepository = makeReadPointByEmailRepository()
    const pointValidatorSpy = makePointValidator()
    const suts = [].concat(
      new CreatePointUseCase({
        createPointRepositorySpy: makeCreatePointRepositorySpyWithError(),
        readPointByEmailRepository,
        pointValidatorSpy
      }),
      new CreatePointUseCase({
        createPointRepositorySpy,
        readPointByEmailRepository: makeReadPointByEmailRepositoryWithError(),
        pointValidatorSpy
      }),
      new CreatePointUseCase({
        createPointRepositorySpy,
        readPointByEmailRepository,
        pointValidatorSpy: makePointValidatorWithError()
      })
    )
    for (const sut of suts) {
      const httpRequest = {
        name: 'any_name',
        latitude: 'any_latitude',
        longitude: 'any_longitude',
        description: 'any_description',
        useremail: 'any_email@email.com'
      }
      const httpResponse = await sut.CreatePoint(httpRequest)
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
      useremail: 'any_email@email.com'
    }
    const httpResponse = await sut.CreatePoint(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.message).toBe(new InvalidParamError('name').message)
  })

  test('Should return 409 if point already exist', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      name: 'any_name',
      latitude: 'any_latitude',
      longitude: 'any_longitude',
      description: 'any_description',
      useremail: 'AlreadyExist@email.com'
    }
    const httpResponse = await sut.CreatePoint(httpRequest)
    expect(httpResponse.statusCode).toBe(409)
    expect(httpResponse.message).toBe('Point Already Exist')
  })

  test('Should return 200 if point was created with sucess', async () => {
    const { createPointRepositorySpy, pointValidatorSpy } = makeSut()
    const ReadPointByEmailRepositoryPointAlreadyExist = makeReadPointByEmailRepositoryPointAlreadyExist()
    const sut =
      new CreatePointUseCase(
        createPointRepositorySpy,
        ReadPointByEmailRepositoryPointAlreadyExist,
        pointValidatorSpy
      )
    const httpRequest = {
      name: 'any_name',
      image: 'base64:aisdãosl,kd2121e2w9392jf',
      latitude: 'any_latitude',
      longitude: 'any_longitude',
      description: 'any_description',
      userId: '1',
      pointId: '1'
    }

    const httpResponse = await sut.CreatePoint(httpRequest)
    console.log(httpResponse.data)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.message).toBe('Successfully')
    expect(httpResponse.data).toEqual(httpRequest)
  })
})
