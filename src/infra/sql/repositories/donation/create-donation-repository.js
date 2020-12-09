const Donation = require('../../entities-db/donation')
const ServerError = require('../../../../utils/errors/server-error')

module.exports = class CreateDonationRepository {
  async CreateDonation (donation) {
    try {
      const { name, description, userId, image, pointId, isPublic } = donation

      return await Donation.create({ name, description, userId, image, pointId, isPublic })
    } catch (err) {
      throw new ServerError()
    }
  }
}
