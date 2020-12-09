const CreateDonationUseCase = require('../../use-cases/donation/create-donation-usecase')
const CreateDonationRepository = require('../../infra/sql/repositories/donation/create-donation-repository')
const ReadDonationRepository = require('../../infra/sql/repositories/donation/read-donation-repository')
const DonationValidator = require('../../utils/validators/donation-validator')

module.exports = class CreateDonationController {
  constructor () {
    this.createDonationRepository = new CreateDonationRepository()
    this.readDonationRepository = new ReadDonationRepository()
    this.donationValidator = new DonationValidator()
    this.createDonationUseCase = new CreateDonationUseCase(this.createDonationRepository, this.donationValidator)
  }

  async CreateDonation (request, response) {
    const returnMessage = await this.createDonationUseCase.CreateDonation(request.body)
    response.status(returnMessage.statusCode).send(returnMessage)
  }
}
