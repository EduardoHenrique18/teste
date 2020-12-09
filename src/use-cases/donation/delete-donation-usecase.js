const InvalidParamError = require('../../utils/errors/invalid-param-error')
const HttpResponse = require('../../utils/http-response')

module.exports = class DeleteDonationUseCase {
  constructor (deleteDonationRepository, deleteDonationValidator) {
    this.deleteDonationRepository = deleteDonationRepository
    this.deleteDonationValidator = deleteDonationValidator
    this.httpResponse = HttpResponse
  }

  async DeleteDonation (donationParam) {
    try {
      const { donationId } = donationParam

      this.deleteDonationValidator.DeleteDonationValidator(donationId)

      const deleteDonation = await this.deleteDonationRepository.DeleteDonation(donationId)

      return this.httpResponse.Ok(deleteDonation)
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
