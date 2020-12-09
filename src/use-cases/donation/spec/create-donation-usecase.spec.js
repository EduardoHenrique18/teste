const CreateDonationUseCase = require('../create-donation-usecase')
const { InvalidParamError } = require('../../../utils/errors')
const HttpResponse = require('../../../utils/http-response')

const makeSut = () => {
  const donationValidatorSpy = makeDonationValidator()
  const createDonationRepositorySpy = makeCreateDonationRepositorySpy()
  const sut = new CreateDonationUseCase(
    createDonationRepositorySpy,
    donationValidatorSpy
  )
  return {
    sut,
    createDonationRepositorySpy,
    donationValidatorSpy
  }
}

const makeDonationValidator = () => {
  class DonationValidatorSpy {
    CreateDonationValidator (Donation) {
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
    createDonationValidatorSpy () {
      throw new Error()
    }
  }
  return new DonationValidatorSpy()
}

const makeCreateDonationRepositorySpy = () => {
  class CreateDonationByEmailRepositorySpy {
    async CreateDonation (Donation) {
      this.donation = Donation
      this.donation.donationId = '1'
      return this.donation
    }
  }
  const createDonationByEmailRepositorySpy = new CreateDonationByEmailRepositorySpy()
  return createDonationByEmailRepositorySpy
}

const makeCreateDonationRepositorySpyWithError = () => {
  class CreateDonationByEmailRepositorySpy {
    async CreateDonation () {
      throw new Error()
    }
  }
  const createDonationByEmailRepositorySpy = new CreateDonationByEmailRepositorySpy()
  return createDonationByEmailRepositorySpy
}

describe('Create Donation UseCase', () => {
  test('Should return 500 if no donationParam is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.CreateDonation()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.message).toBe(HttpResponse.ServerError().message)
  })

  test('Should return 500 if donationParam has no body', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.CreateDonation({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.message).toBe(HttpResponse.ServerError().message)
  })

  test('Should call DonationValidator with correct params', async () => {
    const { sut, donationValidatorSpy } = makeSut()
    const httpRequest = {
      name: 'any_name',
      description: 'any_description',
      image: 'base64:aisdãosl,kd2121e2w9392jf',
      useremail: 'anu_email@email.com'
    }
    await sut.CreateDonation(httpRequest)
    expect(donationValidatorSpy.donation.name).toBe(httpRequest.name)
  })

  test('Should call createDonationRepository with correct params', async () => {
    const { createDonationRepositorySpy, donationValidatorSpy } = makeSut()
    const sut =
      new CreateDonationUseCase(
        createDonationRepositorySpy,
        donationValidatorSpy
      )
    const httpRequest = {
      name: 'any_name',
      description: 'any_description',
      image: 'base64:aisdãosl,kd2121e2w9392jf',
      useremail: 'any_email@email.com'
    }
    await sut.CreateDonation(httpRequest)
    expect(createDonationRepositorySpy.donation.name).toBe(httpRequest.name)
  })

  test('Should throw if any dependency throws', async () => {
    const createDonationRepositorySpy = makeCreateDonationRepositorySpy()
    const donationValidatorSpy = makeDonationValidator()
    const suts = [].concat(
      new CreateDonationUseCase({
        createDonationRepositorySpy: makeCreateDonationRepositorySpyWithError(),
        donationValidatorSpy
      }),
      new CreateDonationUseCase({
        createDonationRepositorySpy,
        donationValidatorSpy: makeDonationValidatorWithError()
      })
    )
    for (const sut of suts) {
      const httpRequest = {
        name: 'any_name',
        description: 'any_description',
        image: 'base64:aisdãosl,kd2121e2w9392jf',
        useremail: 'any_email@email.com'
      }
      const httpResponse = await sut.CreateDonation(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.message).toBe(HttpResponse.ServerError().message)
    }
  })

  test('Should return 400 if an invalid donation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      name: 'name',
      description: 'any_description',
      image: 'base64:aisdãosl,kd2121e2w9392jf',
      useremail: 'any_email@email.com'
    }
    const httpResponse = await sut.CreateDonation(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.message).toBe(new InvalidParamError('name').message)
  })

  test('Should return 200 if donation was created with sucess', async () => {
    const { createDonationRepositorySpy, donationValidatorSpy } = makeSut()
    const sut =
      new CreateDonationUseCase(
        createDonationRepositorySpy,
        donationValidatorSpy
      )
    const httpRequest = {
      name: 'any_name',
      image: 'base64:aisdãosl,kd2121e2w9392jf',
      description: 'any_description',
      userId: '1',
      donationId: '1'
    }

    const httpResponse = await sut.CreateDonation(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.message).toBe('Successfully')
    expect(httpResponse.data).toEqual(httpRequest)
  })
})
