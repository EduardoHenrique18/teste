const User = require('../../entities/User')
const InvalidParamError = require('../../utils/errors/invalid-param-error')
const HttpResponse = require('../../utils/http-response')

module.exports = class LoginUseCase {
  constructor (readUserRepository, userValidator, hash, tokenGenerator) {
    this.userValidator = userValidator
    this.readUserRepository = readUserRepository
    this.hash = hash
    this.tokenGenerator = tokenGenerator
    this.httpResponse = HttpResponse
  }

  async Login (userParam) {
    try {
      const { userName, password, dateOfBirth, email } = userParam

      const user = new User(userName, password, dateOfBirth, email)

      this.userValidator.LoginValidator(user)

      const userSearched = await this.readUserRepository.ReadUserByEmail(user)

      if (!userSearched) {
        return this.httpResponse.unauthorizedError()
      }

      const passwordCompared = await this.hash.compareHash(password, userSearched.password)

      if (!passwordCompared) {
        return this.httpResponse.unauthorizedError()
      }

      const token = await this.tokenGenerator.generate(userSearched._id.toString())
      return this.httpResponse.Ok({ userSearched, token })
    } catch (error) {
      if (error instanceof InvalidParamError) {
        console.log(error)
        return this.httpResponse.InvalidParamError(error.message)
      } else {
        console.log(error)
        return this.httpResponse.ServerError()
      }
    }
  }
}
