const Donation = require('../../entities/donation')
const InvalidParamError = require('../../utils/errors/invalid-param-error')
const HttpResponse = require('../../utils/http-response')

module.exports = class CreateDonationUseCase {
  constructor (createDonationRepository, donationValidator) {
    this.createDonationRepository = createDonationRepository
    this.donationValidator = donationValidator
    this.httpResponse = HttpResponse
  }

  async CreateDonation (donationParam) {
    try {
      const { name, description, image, userId, pointId, isPublic } = donationParam

      const donation = new Donation(name, description, image, isPublic, userId, pointId)

      this.donationValidator.CreateDonationValidator(donation)

      const createdDonation = await this.createDonationRepository.CreateDonation(donation)

      return this.httpResponse.Ok(createdDonation)
    } catch (error) {
      if (error instanceof InvalidParamError) {
        console.log(error)
        return this.httpResponse.InvalidParamError(error.message)
      } else {
        console.log(error)
        return this.httpResponse.ServerError()
      }
    }
  }
}
