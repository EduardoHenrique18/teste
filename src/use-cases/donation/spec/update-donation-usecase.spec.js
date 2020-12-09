const UpdateDonationUseCase = require('../update-donation-usecase')
const { InvalidParamError } = require('../../../utils/errors')
const HttpResponse = require('../../../utils/http-response')

const makeSut = () => {
  const donationValidatorSpy = makeDonationValidator()
  const updateDonationRepositorySpy = makeUpdateDonationRepositorySpy()
  const sut = new UpdateDonationUseCase(
    updateDonationRepositorySpy,
    donationValidatorSpy
  )
  return {
    sut,
    updateDonationRepositorySpy,
    donationValidatorSpy
  }
}

const makeDonationValidator = () => {
  class DonationValidatorSpy {
    UpdateDonationValidator (Donation) {
      this.donation = Donation
      if (this.donation.name.length < 5) {
        throw new InvalidParamError('name')
      }
    }
  }
  const donationValidatorSpy = new DonationValidatorSpy()
  return donationValidatorSpy
}

const makeDonationValidatorWithError = () => {
  class DonationValidatorSpy {
    updateDonationValidatorSpy () {
      throw new Error()
    }
  }
  return new DonationValidatorSpy()
}

const makeUpdateDonationRepositorySpy = () => {
  class UpdateDonationByEmailRepositorySpy {
    async UpdateDonation (Donation) {
      this.donation = Donation
      this.donation.donationId = '1'
      return this.donation
    }
  }
  const updateDonationByEmailRepositorySpy = new UpdateDonationByEmailRepositorySpy()
  return updateDonationByEmailRepositorySpy
}

const makeUpdateDonationRepositorySpyWithError = () => {
  class UpdateDonationByEmailRepositorySpy {
    async UpdateDonation () {
      throw new Error()
    }
  }
  const updateDonationByEmailRepositorySpy = new UpdateDonationByEmailRepositorySpy()
  return updateDonationByEmailRepositorySpy
}

describe('Update Donation UseCase', () => {
  test('Should return 500 if no donationParam is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.UpdateDonation()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.message).toBe(HttpResponse.ServerError().message)
  })

  test('Should return 500 if donationParam has no body', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.UpdateDonation({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.message).toBe(HttpResponse.ServerError().message)
  })

  test('Should call DonationValidator with correct params', async () => {
    const { sut, donationValidatorSpy } = makeSut()
    const httpRequest = {
      name: 'any_name',
      description: 'any_description',
      userId: '1',
      image: 'base64:aisdãosl,kd2121e2w9392jf',
      donationId: '1',
      pointId: '1',
      isPublic: true
    }
    await sut.UpdateDonation(httpRequest)
    expect(donationValidatorSpy.donation.name).toBe(httpRequest.name)
  })

  test('Should call updateDonationRepository with correct params', async () => {
    const { updateDonationRepositorySpy, sut } = makeSut()
    const httpRequest = {
      name: 'any_name',
      description: 'any_description',
      userId: '1',
      image: 'base64:aisdãosl,kd2121e2w9392jf',
      donationId: '1',
      pointId: '1',
      isPublic: true
    }
    await sut.UpdateDonation(httpRequest)
    expect(updateDonationRepositorySpy.donation.name).toBe(httpRequest.name)
  })

  test('Should throw if any dependency throws', async () => {
    const updateDonationRepositorySpy = makeUpdateDonationRepositorySpy()
    const donationValidatorSpy = makeDonationValidator()
    const suts = [].concat(
      new UpdateDonationUseCase({
        updateDonationRepositorySpy: makeUpdateDonationRepositorySpyWithError(),
        donationValidatorSpy
      }),
      new UpdateDonationUseCase({
        updateDonationRepositorySpy,
        donationValidatorSpy: makeDonationValidatorWithError()
      })
    )
    for (const sut of suts) {
      const httpRequest = {
        name: 'any_name',
        description: 'any_description',
        userId: '1',
        image: 'base64:aisdãosl,kd2121e2w9392jf',
        donationId: '1',
        pointId: '1',
        isPublic: true
      }
      const httpResponse = await sut.UpdateDonation(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.message).toBe(HttpResponse.ServerError().message)
    }
  })

  test('Should return 400 if an invalid donation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      name: 'any_',
      description: 'any_description',
      userId: '1',
      image: 'base64:aisdãosl,kd2121e2w9392jf',
      donationId: '1',
      pointId: '1',
      isPublic: true
    }
    const httpResponse = await sut.UpdateDonation(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.message).toBe(new InvalidParamError('name').message)
  })

  test('Should return 200 if donation was updated with sucess', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      name: 'any_name',
      description: 'any_description',
      userId: '1',
      image: 'base64:aisdãosl,kd2121e2w9392jf',
      donationId: '1',
      pointId: '1',
      isPublic: true
    }

    const httpResponse = await sut.UpdateDonation(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.message).toBe('Successfully')
    expect(httpResponse.data).toEqual(httpRequest)
  })
})
