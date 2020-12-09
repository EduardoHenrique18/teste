const Donation = require('../../entities-db/donation')
const ServerError = require('../../../../utils/errors/server-error')

module.exports = class ReadDonationRepository {
  async ReadDonationByPointId (pointId) {
    try {
      return await Donation.findById({ pointId })
    } catch (err) {
      console.log(err)
      throw new ServerError()
    }
  }

  async ReadDonationByImage (donation) {
    try {
      const { image } = donation

      return await Donation.findOne({ image })
    } catch (err) {
      throw new ServerError()
    }
  }
}
