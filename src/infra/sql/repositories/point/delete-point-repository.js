const Point = require('../../entities-db/point')
const ServerError = require('../../../../utils/errors/server-error')

module.exports = class DeletePointRepository {
  async DeletePoint (point) {
    try {
      const { pointId } = point

      const _id = pointId

      return await Point.deleteOne({ _id })
    } catch (err) {
      console.log(err)
      throw new ServerError()
    }
  }
}
