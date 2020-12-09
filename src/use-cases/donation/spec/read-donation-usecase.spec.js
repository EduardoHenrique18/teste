const ReadByPointIdDonationUseCase = require('../readByPointId-donation-usecase')
const HttpResponse = require('../../../utils/http-response')
const InvalidParamError = require('../../../utils/errors/invalid-param-error')

const makeSut = () => {
  const readByPointIdDonationRepository = makeReadByPointIdDonationRepository()
  const donationValidator = makeDonationValidator()
  const sut = new ReadByPointIdDonationUseCase(
    readByPointIdDonationRepository,
    donationValidator
  )
  return {
    sut,
    readByPointIdDonationRepository,
    donationValidator
  }
}

const makeReadByPointIdDonationRepository = () => {
  class ReadByPointIdDonationRepository {
    async ReadDonationByPointId (pointId) {
      this.pointId = pointId
      const donations = [
        {
          name: 'donation1'
        },
        {
          name: 'donation2'
        }
      ]
      return donations
    }
  }
  const readByPointIdDonationRepository = new ReadByPointIdDonationRepository()
  return readByPointIdDonationRepository
}

const makeReadDonationRepositoryWithError = () => {
  class ReadByPointIdDonationRepository {
    async ReadDonationByPointId () {
      throw new Error()
    }
  }
  const readByPointIdDonationRepository = new ReadByPointIdDonationRepository()
  return readByPointIdDonationRepository
}

const makeDonationValidator = () => {
  class DonationValidatorSpy {
    ReadByPointIdDonationValidator (pointId) {
      this.pointId = pointId
      if (this.pointId === '2') {
        throw new InvalidParamError('pointId')
      }
    }
  }
  const donationValidatorSpy = new DonationValidatorSpy()
  return donationValidatorSpy
}

const makeDonationValidatorWithError = () => {
  class DonationValidatorSpy {
    ReadByPointIdDonationValidator () {
      throw new Error()
    }
  }
  return new DonationValidatorSpy()
}

describe('Read Donation UseCase', () => {
  test('Should call readDonationRepository with correct params', async () => {
    const { sut, readByPointIdDonationRepository } = makeSut()
    const request = {
      pointId: '1'
    }
    await sut.ReadByPointIdDonation(request)
    expect(readByPointIdDonationRepository.pointId).toBe(request.pointId)
  })

  test('Should call donationValidator with correct params', async () => {
    const { sut, donationValidator } = makeSut()
    const request = {
      pointId: '1'
    }
    await sut.ReadByPointIdDonation(request)
    expect(donationValidator.pointId).toBe(request.pointId)
  })

  test('Should throw if any dependency throws', async () => {
    const { readByPointIdDonationRepository, donationValidator } = makeSut()
    const request = {
      pointId: '1'
    }
    const suts = [].concat(
      new ReadByPointIdDonationUseCase({
        readDonationRepositorySpy: makeReadDonationRepositoryWithError(),
        donationValidator
      }),
      new ReadByPointIdDonationUseCase({
        readDonationRepositorySpy: readByPointIdDonationRepository,
        donationValidator: makeDonationValidatorWithError()
      })
    )
    for (const sut of suts) {
      const httpResponse = await sut.ReadByPointIdDonation(request)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.message).toBe(HttpResponse.ServerError().message)
    }
  })

  test('Should return 400 if an invalid pointId is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      pointId: '2'
    }
    const httpResponse = await sut.ReadByPointIdDonation(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.message).toBe(new InvalidParamError('pointId').message)
  })

  test('Should return 200 if donation was readd with sucess', async () => {
    const { sut } = makeSut()
    const donations = [
      {
        name: 'donation1'
      },
      {
        name: 'donation2'
      }
    ]
    const request = {
      pointId: '1'
    }
    const httpResponse = await sut.ReadByPointIdDonation(request)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.message).toBe('Successfully')
    expect(httpResponse.data).toEqual(donations)
  })
})
