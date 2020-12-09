const Point = require('../../entities-db/point')
const ServerError = require('../../../../utils/errors/server-error')

module.exports = class CreatePointRepository {
  async CreatePoint (point) {
    try {
      const { name, latitude, longitude, description, userId, image, disable } = point

      return await Point.create({ name, latitude, longitude, description, userId, image, disable })
    } catch (err) {
      console.log(err)
      throw new ServerError()
    }
  }
}
