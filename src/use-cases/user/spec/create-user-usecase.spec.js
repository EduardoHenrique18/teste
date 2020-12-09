const CreateUserUseCase = require('../create-user-usecase')
const { InvalidParamError } = require('../../../utils/errors')
const HttpResponse = require('../../../utils/http-response')

const makeSut = () => {
  const userValidatorSpy = makeUserValidator()
  const readUserRepositorySpy = makeReadUserByEmailRepository()
  const createUserRepositorySpy = makeCreateUserRepositorySpy()
  const hash = makeHash()
  const sut = new CreateUserUseCase(
    createUserRepositorySpy,
    readUserRepositorySpy,
    userValidatorSpy,
    hash
  )
  return {
    sut,
    readUserRepositorySpy,
    createUserRepositorySpy,
    userValidatorSpy,
    hash
  }
}

const makeUserValidator = () => {
  class UserValidatorSpy {
    CreateUserValidator (User) {
      this.user = User
      if (this.user.userName.length < 5) {
        throw new InvalidParamError('userName')
      }
    }
  }
  const userValidatorSpy = new UserValidatorSpy()
  return userValidatorSpy
}

const makeUserValidatorWithError = () => {
  class UserValidatorSpy {
    createUserValidatorSpy () {
      throw new Error()
    }
  }
  return new UserValidatorSpy()
}

const makeHash = () => {
  class Hash {
    generateHash (field) {
      return field
    }

    compareHash (field) {
      return field
    }
  }
  return new Hash()
}

/* const makeHashWithError = () => {
  class Hash {
    generateHash () {
      throw new Error()
    }

    compareHash () {
      throw new Error()
    }
  }
  return new Hash()
} */

const makeReadUserByEmailRepository = () => {
  class ReadUserByEmailRepositorySpy {
    async ReadUserByEmail (User) {
      this.user = User
      if (this.user.email === 'AlreadyExist@email.com') {
        return HttpResponse.conflictError('User Already Exist')
      }
      return this.user
    }
  }
  const readUserByEmailRepositorySpy = new ReadUserByEmailRepositorySpy()
  return readUserByEmailRepositorySpy
}

const makeReadUserByEmailRepositoryUserAlreadyExist = () => {
  class ReadUserByEmailRepositorySpy {
    async ReadUserByEmail (User) {
      this.user = User
      return null
    }
  }
  const readUserByEmailRepositorySpy = new ReadUserByEmailRepositorySpy()
  return readUserByEmailRepositorySpy
}

const makeReadUserByEmailRepositoryWithError = () => {
  class ReadUserByEmailRepositorySpy {
    async ReadUserByEmail () {
      throw new Error()
    }
  }
  const readUserByEmailRepositorySpy = new ReadUserByEmailRepositorySpy()
  return readUserByEmailRepositorySpy
}

const makeCreateUserRepositorySpy = () => {
  class CreateUserByEmailRepositorySpy {
    async CreateUser (User) {
      this.user = User
      return this.user
    }
  }
  const createUserByEmailRepositorySpy = new CreateUserByEmailRepositorySpy()
  return createUserByEmailRepositorySpy
}

const makeCreateUserRepositorySpyWithError = () => {
  class CreateUserByEmailRepositorySpy {
    async CreateUser () {
      throw new Error()
    }
  }
  const createUserByEmailRepositorySpy = new CreateUserByEmailRepositorySpy()
  return createUserByEmailRepositorySpy
}

describe('Create User UseCase', () => {
  test('Should return 500 if no userParam is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.CreateUser()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.message).toBe(HttpResponse.ServerError().message)
  })

  test('Should return 500 if userParam has no body', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.CreateUser({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.message).toBe(HttpResponse.ServerError().message)
  })

  test('Should call UserValidator with correct params', async () => {
    const { sut, userValidatorSpy } = makeSut()
    const httpRequest = {
      user: {
        userName: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        dateOfBirth: 'any_date'
      }
    }
    await sut.CreateUser(httpRequest)
    expect(userValidatorSpy.user.userName).toBe(httpRequest.userName)
  })

  test('Should call readUserByEmailRepository with correct params', async () => {
    const { sut, readUserRepositorySpy } = makeSut()
    const httpRequest = {
      userName: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
      dateOfBirth: 'any_date'

    }
    await sut.CreateUser(httpRequest)
    expect(readUserRepositorySpy.user.userName).toBe(httpRequest.userName)
  })

  test('Should call createUserRepository with correct params', async () => {
    const { createUserRepositorySpy, userValidatorSpy, hash } = makeSut()
    const ReadUserByEmailRepositoryUserAlreadyExist = makeReadUserByEmailRepositoryUserAlreadyExist()
    const sut =
      new CreateUserUseCase(
        createUserRepositorySpy,
        ReadUserByEmailRepositoryUserAlreadyExist,
        userValidatorSpy,
        hash
      )
    const httpRequest = {
      userName: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
      dateOfBirth: 'any_date'
    }
    await sut.CreateUser(httpRequest)
    expect(createUserRepositorySpy.user.userName).toBe(httpRequest.userName)
  })

  test('Should throw if any dependency throws', async () => {
    const createUserRepositorySpy = makeCreateUserRepositorySpy()
    const readUserByEmailRepository = makeReadUserByEmailRepository()
    const userValidatorSpy = makeUserValidator()
    const suts = [].concat(
      new CreateUserUseCase({
        createUserRepositorySpy: makeCreateUserRepositorySpyWithError(),
        readUserByEmailRepository,
        userValidatorSpy
      }),
      new CreateUserUseCase({
        createUserRepositorySpy,
        readUserByEmailRepository: makeReadUserByEmailRepositoryWithError(),
        userValidatorSpy
      }),
      new CreateUserUseCase({
        createUserRepositorySpy,
        readUserByEmailRepository,
        userValidatorSpy: makeUserValidatorWithError()
      })
    )
    for (const sut of suts) {
      const httpRequest = {
        userName: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        dateOfBirth: 'any_date'
      }
      const httpResponse = await sut.CreateUser(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.message).toBe(HttpResponse.ServerError().message)
    }
  })

  test('Should return 400 if an invalid user is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      userName: 'name',
      email: 'any_email@email.com',
      password: 'any_password',
      dateOfBirth: 'any_date'
    }
    const httpResponse = await sut.CreateUser(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.message).toBe(new InvalidParamError('userName').message)
  })

  test('Should return 409 if user already exist', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      userName: 'any_name',
      email: 'AlreadyExist@email.com',
      password: 'any_password',
      dateOfBirth: 'any_date'
    }
    const httpResponse = await sut.CreateUser(httpRequest)
    expect(httpResponse.statusCode).toBe(409)
    expect(httpResponse.message).toBe('User Already Exist')
  })

  test('Should return 200 if user was created with sucess', async () => {
    const { createUserRepositorySpy, userValidatorSpy, hash } = makeSut()
    const ReadUserByEmailRepositoryUserAlreadyExist = makeReadUserByEmailRepositoryUserAlreadyExist()
    const sut =
      new CreateUserUseCase(
        createUserRepositorySpy,
        ReadUserByEmailRepositoryUserAlreadyExist,
        userValidatorSpy,
        hash
      )
    const httpRequest = {
      userName: 'any_name',
      email: 'AlreadyExist@email.com',
      password: 'any_password',
      dateOfBirth: '2000/01/16'
    }
    const httpResponse = await sut.CreateUser(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.message).toBe('Successfully')
    expect(httpResponse.data).toEqual(httpRequest)
  })
})
