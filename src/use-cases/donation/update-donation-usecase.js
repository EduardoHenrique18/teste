const Donation = require('../../entities/Donation')
const InvalidParamError = require('../../utils/errors/invalid-param-error')
const HttpResponse = require('../../utils/http-response')

module.exports = class UpdateDonationUseCase {
  constructor (updateDonationRepository, donationValidator) {
    this.updateDonationRepository = updateDonationRepository
    this.donationValidator = donationValidator
    this.httpResponse = HttpResponse
  }

  async UpdateDonation (donationParam) {
    try {
      const { name, description, image, userId, pointId, isPublic, donationId } = donationParam

      const donation = new Donation(name, description, image, isPublic, userId, pointId, donationId)

      this.donationValidator.UpdateDonationValidator(donation)

      await this.updateDonationRepository.UpdateDonation(donation)

      return this.httpResponse.Ok({ name, description, image, userId, pointId, isPublic, donationId })
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
