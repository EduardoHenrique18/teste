const Donation = require('../../entities-db/donation')
const ServerError = require('../../../../utils/errors/server-error')

module.exports = class DeleteDonationRepository {
  async DeleteDonation (donationId) {
    try {
      return await Donation.deleteOne({ donationId })
    } catch (err) {
      console.log(err)
      throw new ServerError()
    }
  }
}
