const DeleteDonationUseCase = require('../../use-cases/donation/delete-donation-usecase')
const DeleteDonationRepository = require('../../Infra/Sql/Repositories/Donation/delete-donation-repository')
const DonationValidator = require('../../utils/validators/donation-validator')

module.exports = class DeleteDonationController {
  constructor () {
    this.deleteDonationRepository = new DeleteDonationRepository()
    this.donationValidator = new DonationValidator()
    this.deleteDonationUseCase = new DeleteDonationUseCase(this.deleteDonationRepository, this.donationValidator)
  }

  async DeleteDonation (request, response) {
    const returnMessage = await this.deleteDonationUseCase.DeleteDonation(request.params)
    response.status(returnMessage.statusCode).send(returnMessage)
  }
}
