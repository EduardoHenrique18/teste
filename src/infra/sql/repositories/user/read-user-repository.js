const User = require('../../entities-db/user')
const ServerError = require('../../../../utils/errors/server-error')

module.exports = class ReadUserRepository {
  async ReadUserByEmail (userParam) {
    try {
      const { email } = userParam

      return await User.findOne({ email })
    } catch (err) {
      throw new ServerError()
    }
  }
}
