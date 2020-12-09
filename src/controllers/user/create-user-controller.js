const CreateUserUseCase = require('../../use-cases/user/create-user-usecase')
const CreateUserRepository = require('../../Infra/Sql/Repositories/User/create-user-repository')
const ReadUserRepository = require('../../Infra/Sql/Repositories/User/read-user-repository')
const UserValidator = require('../../utils/validators/user-validator')
const Hash = require('../../utils/hash/hash')

module.exports = class CreateUserController {
  constructor () {
    this.createUserRepository = new CreateUserRepository()
    this.readUserRepository = new ReadUserRepository()
    this.userValidator = new UserValidator()
    this.hash = new Hash()
    this.createUserUseCase = new CreateUserUseCase(this.createUserRepository, this.readUserRepository, this.userValidator, this.hash)
  }

  async CreateUser (request, response) {
    const returnMessage = await this.createUserUseCase.CreateUser(request.body)
    response.status(returnMessage.statusCode).send(returnMessage)
  }
}
