const User = require('../../entities-db/user')
const ServerError = require('../../../../utils/errors/server-error')

module.exports = class CreateUserRepository {
  async CreateUser (user) {
    try {
      const { userName, password, email, dateOfBirth } = user

      return await User.create({ userName, email, password, dateOfBirth })
    } catch (err) {
      throw new ServerError()
    }
  }
}
