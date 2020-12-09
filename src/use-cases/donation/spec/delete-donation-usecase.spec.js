const DeleteDonationUseCase = require('../delete-donation-usecase')
const HttpResponse = require('../../../utils/http-response')
const InvalidParamError = require('../../../utils/errors/invalid-param-error')

const makeSut = () => {
  const deleteDonationRepositorySpy = makeDeleteDonationRepository()
  const donationValidator = makeDonationValidator()
  const sut = new DeleteDonationUseCase(
    deleteDonationRepositorySpy,
    donationValidator
  )
  return {
    sut,
    deleteDonationRepositorySpy,
    donationValidator
  }
}

const makeDeleteDonationRepository = () => {
  class DeleteDonationRepositorySpy {
    async DeleteDonation (param) {
      this.donationId = param
      return this.donationId
    }
  }
  const deleteDonationRepositorySpy = new DeleteDonationRepositorySpy()
  return deleteDonationRepositorySpy
}

const makeDeleteDonationRepositoryWithError = () => {
  class DeleteDonationRepositorySpy {
    async DeleteDonation () {
      throw new Error()
    }
  }
  const deleteDonationRepositorySpy = new DeleteDonationRepositorySpy()
  return deleteDonationRepositorySpy
}

const makeDonationValidator = () => {
  class DonationValidatorSpy {
    DeleteDonationValidator (donationId) {
      this.donationId = donationId
      if (donationId === 'incorrectId') {
        throw new InvalidParamError('donationId')
      }
    }
  }
  const donationValidatorSpy = new DonationValidatorSpy()
  return donationValidatorSpy
}

const makeDonationValidatorWithError = () => {
  class DonationValidatorSpy {
    DeleteDonationValidator () {
      throw new Error()
    }
  }
  return new DonationValidatorSpy()
}

describe('Create Donation UseCase', () => {
  test('Should return 500 if no donationParam is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.DeleteDonation()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.message).toBe(HttpResponse.ServerError().message)
  })

  test('Should call deleteDonationRepository with correct params', async () => {
    const { sut, deleteDonationRepositorySpy } = makeSut()
    const httpRequest = {
      donationId: '1'
    }
    await sut.DeleteDonation(httpRequest)
    expect(deleteDonationRepositorySpy.donationId).toBe(httpRequest.donationId)
  })

  test('Should call donationValidator with correct params', async () => {
    const { sut, donationValidator } = makeSut()
    const httpRequest = {
      donationId: '1'
    }
    await sut.DeleteDonation(httpRequest)
    expect(donationValidator.donationId).toBe(httpRequest.donationId)
  })

  test('Should return 400 if an invalid donationId is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      donationId: 'incorrectId'
    }
    const httpResponse = await sut.DeleteDonation(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.message).toBe(new InvalidParamError('donationId').message)
  })

  test('Should throw if any dependency throws', async () => {
    const { deleteDonationRepositorySpy, donationValidator } = makeSut()
    const suts = [].concat(
      new DeleteDonationUseCase({
        deleteDonationRepositorySpy: makeDeleteDonationRepositoryWithError(),
        donationValidator: donationValidator
      }),
      new DeleteDonationUseCase({
        deleteDonationRepositorySpy: deleteDonationRepositorySpy,
        donationValidator: makeDonationValidatorWithError()
      })
    )
    for (const sut of suts) {
      const httpRequest = {
        donationId: '1'
      }
      const httpResponse = await sut.DeleteDonation(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.message).toBe(HttpResponse.ServerError().message)
    }
  })

  test('Should return 200 if donation was deleted with sucess', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      donationId: '1'
    }

    const httpResponse = await sut.DeleteDonation(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.message).toBe('Successfully')
    expect(httpResponse.data).toEqual(httpRequest.donationId)
  })
})
