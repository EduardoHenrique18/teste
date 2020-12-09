const LoginUseCase = require('../../use-cases/user/login-usecase')
const ReadUserRepository = require('../../Infra/Sql/Repositories/user/read-user-repository')
const LoginValidator = require('../../utils/validators/user-validator')
const Hash = require('../../utils/hash/hash')
const TokenGenerator = require('../../utils/auth/token-generator')

module.exports = class LoginController {
  constructor () {
    this.readUserRepository = new ReadUserRepository()
    this.loginValidator = new LoginValidator()
    this.hash = new Hash()
    this.tokenGenerator = new TokenGenerator()
    this.LoginUseCase = new LoginUseCase(this.readUserRepository, this.loginValidator, this.hash, this.tokenGenerator)
  }

  async Login (request, response) {
    const returnMessage = await this.LoginUseCase.Login(request.body)
    response.status(returnMessage.statusCode).send(returnMessage)
  }
}
