const HttpResponse = require('../../utils/http-response')
const InvalidParamError = require('../../utils/errors/invalid-param-error')

module.exports = class ReadByPointIdDonationUseCase {
  constructor (readByPointIdDonationRepository, donationValidator) {
    this.readByPointIdDonationRepository = readByPointIdDonationRepository
    this.donationValidator = donationValidator
    this.httpResponse = HttpResponse
  }

  async ReadByPointIdDonation (pointIdParam) {
    try {
      const { pointId } = pointIdParam

      this.donationValidator.ReadByPointIdDonationValidator(pointId)

      const donations = await this.readByPointIdDonationRepository.ReadDonationByPointId(pointId)

      return this.httpResponse.Ok(donations)
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
