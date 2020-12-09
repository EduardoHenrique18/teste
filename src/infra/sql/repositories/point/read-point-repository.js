const Point = require('../../entities-db/point')
const ServerError = require('../../../../utils/errors/server-error')

module.exports = class ReadPointRepository {
  async ReadPointByLongAndLat (point) {
    try {
      const { longitude, latitude } = point
      return await Point.findOne({ longitude, latitude })
    } catch (err) {
      throw new ServerError()
    }
  }

  async ReadAllPoint () {
    try {
      return await Point.find()
    } catch (err) {
      throw new ServerError()
    }
  }
}
