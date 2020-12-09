const UpdateDonationUseCase = require('../../use-cases/donation/update-donation-usecase')
const UpdateDonationRepository = require('../../Infra/Sql/Repositories/Donation/update-donation-repository')
const DonationValidator = require('../../utils/validators/donation-validator')

module.exports = class UpdateDonationController {
  constructor () {
    this.updateDonationRepository = new UpdateDonationRepository()
    this.donationValidator = new DonationValidator()
    this.updateDonationUseCase = new UpdateDonationUseCase(this.updateDonationRepository, this.donationValidator)
  }

  async UpdateDonation (request, response) {
    const returnMessage = await this.updateDonationUseCase.UpdateDonation(request.body)
    response.status(returnMessage.statusCode).send(returnMessage)
  }
}
