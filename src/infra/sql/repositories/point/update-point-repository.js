const Point = require('../../entities-db/point')
const ServerError = require('../../../../utils/errors/server-error')

module.exports = class UpdatePointRepository {
  async UpdatePoint (point) {
    try {
      const { pointId, name, latitude, longitude, description, image, userEmail } = point

      return await Point.findOneAndUpdate(pointId, { name, latitude, longitude, description, image, userEmail })
    } catch (err) {
      throw new ServerError()
    }
  }
}
