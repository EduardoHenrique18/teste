const LoginUsecase = require('../login-usecase')
const { InvalidParamError } = require('../../../utils/errors')
const HttpResponse = require('../../../utils/http-response')

const makeSut = () => {
  const userValidatorSpy = makeUserValidator()
  const readUserRepositorySpy = makeReadUserByEmailRepository()
  const hash = makeHash()
  const tokenGenerator = makeTokenGenerator()
  const sut = new LoginUsecase(
    readUserRepositorySpy,
    userValidatorSpy,
    hash,
    tokenGenerator
  )
  return {
    sut,
    readUserRepositorySpy,
    userValidatorSpy,
    hash,
    tokenGenerator
  }
}

const makeUserValidator = () => {
  class UserValidatorSpy {
    LoginValidator (User) {
      this.user = User
      if (!this.user.email.includes('@')) {
        throw new InvalidParamError('email')
      }
    }
  }
  const userValidatorSpy = new UserValidatorSpy()
  return userValidatorSpy
}

const makeUserValidatorWithError = () => {
  class UserValidatorSpy {
    LoginValidator () {
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

const makeHashWithFalseCompare = () => {
  class Hash {
    generateHash (field) {
      return field
    }

    compareHash (field) {
      return false
    }
  }
  return new Hash()
}

const makeHashWithError = () => {
  class Hash {
    generateHash () {
      throw new Error()
    }

    compareHash () {
      throw new Error()
    }
  }
  return new Hash()
}

const makeReadUserByEmailRepository = () => {
  class ReadUserByEmailRepositorySpy {
    async ReadUserByEmail (User) {
      this.user = User
      return this.user
    }
  }
  const readUserByEmailRepositorySpy = new ReadUserByEmailRepositorySpy()
  return readUserByEmailRepositorySpy
}

const makeReadUserByEmailRepositoryUserDontExist = () => {
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

const makeTokenGenerator = () => {
  class TokenGenerator {
    async generate (userId) {
      return 'token'
    }
  }
  const tokenGenerator = new TokenGenerator()
  return tokenGenerator
}

const makeTokenGeneratorWithError = () => {
  class TokenGenerator {
    async generate (userId) {
      throw new Error()
    }
  }
  const tokenGenerator = new TokenGenerator()
  return tokenGenerator
}

describe('Login UseCase', () => {
  test('Should return 500 if no userParam is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.Login()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.message).toBe(HttpResponse.ServerError().message)
  })

  test('Should return 500 if userParam has no body', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.Login({})
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
    await sut.Login(httpRequest)
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
    await sut.Login(httpRequest)
    expect(readUserRepositorySpy.user.userName).toBe(httpRequest.userName)
  })

  test('Should throw if any dependency throws', async () => {
    const hash = makeHash()
    const readUserByEmailRepository = makeReadUserByEmailRepository()
    const userValidatorSpy = makeUserValidator()
    const tokenGenerator = makeTokenGenerator()
    const suts = [].concat(
      new LoginUsecase({
        hash: makeHashWithError(),
        readUserByEmailRepository,
        userValidatorSpy,
        tokenGenerator
      }),
      new LoginUsecase({
        hash,
        readUserByEmailRepository: makeReadUserByEmailRepositoryWithError(),
        userValidatorSpy,
        tokenGenerator
      }),
      new LoginUsecase({
        hash,
        readUserByEmailRepository,
        userValidatorSpy: makeUserValidatorWithError(),
        tokenGenerator
      }),
      new LoginUsecase({
        hash,
        readUserByEmailRepository,
        userValidatorSpy,
        tokenGenerator: makeTokenGeneratorWithError()
      })
    )
    for (const sut of suts) {
      const httpRequest = {
        userName: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        dateOfBirth: 'any_date'
      }
      const httpResponse = await sut.Login(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.message).toBe(HttpResponse.ServerError().message)
    }
  })

  test('Should return 400 if an invalid user is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      userName: 'name',
      email: 'any_emailemail.com',
      password: 'any_password',
      dateOfBirth: 'any_date'
    }
    const httpResponse = await sut.Login(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.message).toBe(new InvalidParamError('email').message)
  })

  test('Should return 200 if user was created with sucess', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      userName: 'any_name',
      email: 'AlreadyExist@email.com',
      password: 'any_password',
      dateOfBirth: '2000/01/16'
    }
    const response = {
      token: 'token',
      userSearched: {
        dateOfBirth: '2000/01/16',
        email: 'AlreadyExist@email.com',
        password: 'any_password',
        userName: 'any_name'
      }
    }
    const httpResponse = await sut.Login(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.message).toBe('Successfully')
    expect(httpResponse.data).toEqual(response)
  })

  test('Should return 401 if user dont exist', async () => {
    const { userValidatorSpy, hash, tokenGenerator } = makeSut()
    const makeReadUserByEmailRepository = makeReadUserByEmailRepositoryUserDontExist()
    const sut =
      new LoginUsecase(
        makeReadUserByEmailRepository,
        userValidatorSpy,
        hash,
        tokenGenerator
      )
    const httpRequest = {
      userName: 'any_name',
      email: 'AlreadyExist@email.com',
      password: 'any_password',
      dateOfBirth: '2000/01/16'
    }

    const httpResponse = await sut.Login(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
  })

  test('Should return 401 if pasword isnt correct', async () => {
    const { userValidatorSpy, tokenGenerator, readUserRepositorySpy } = makeSut()
    const hash = makeHashWithFalseCompare()
    const sut =
      new LoginUsecase(
        readUserRepositorySpy,
        userValidatorSpy,
        hash,
        tokenGenerator
      )
    const httpRequest = {
      userName: 'any_name',
      email: 'AlreadyExist@email.com',
      password: 'any_password',
      dateOfBirth: '2000/01/16'
    }

    const httpResponse = await sut.Login(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
  })
})
