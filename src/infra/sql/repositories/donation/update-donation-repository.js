const Donation = require('../../entities-db/donation')
const ServerError = require('../../../../utils/errors/server-error')

module.exports = class UpdateDonationRepository {
  async UpdateDonation (donation) {
    try {
      const { name, description, userId, image, pointId, isPublic, donationId } = donation

      return await Donation.findOneAndUpdate(donationId, { name, description, userId, image, pointId, isPublic, donationId })
    } catch (err) {
      throw new ServerError()
    }
  }
}
