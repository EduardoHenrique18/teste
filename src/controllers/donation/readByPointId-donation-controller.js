const ReadByPointIdDonationUseCase = require('../../use-cases/donation/readByPointId-donation-usecase')
const ReadDonationRepository = require('../../infra/sql/repositories/donation/read-donation-repository')
const DonationValidator = require('../../utils/validators/donation-validator')

module.exports = class ReadByPointIdDonationController {
  constructor () {
    this.readDonationRepository = new ReadDonationRepository()
    this.donationValidator = new DonationValidator()
    this.readByPointIdDonationUseCase = new ReadByPointIdDonationUseCase(this.readDonationRepository, this.donationValidator)
  }

  async ReadByPointIdDonation (request, response) {
    const returnMessage = await this.readByPointIdDonationUseCase.ReadByPointIdDonation(request.params)
    response.status(returnMessage.statusCode).send(returnMessage)
  }
}
