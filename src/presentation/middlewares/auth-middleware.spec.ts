import { AuthMiddleware } from './auth-middleware'
import { AccountModel, HttpRequest, LoadAccountByToken } from './auth-middleware-protocols'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  email: 'any_email@mail.com',
  name: 'any_name',
  password: 'hashed_password'
})

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

const makeLoadAccountByAccessToken = (): LoadAccountByToken => {
  class LoadAccountByAccessTokenStub implements LoadAccountByToken {
    async load (accessToken: string): Promise<AccountModel | null> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByAccessTokenStub()
}

interface sutTypes {
  sut: AuthMiddleware
  loadAccountByAccessTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): sutTypes => {
  const loadAccountByAccessTokenStub = makeLoadAccountByAccessToken()
  const sut = new AuthMiddleware(loadAccountByAccessTokenStub, role)
  return {
    sut,
    loadAccountByAccessTokenStub
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByAccessTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByAccessTokenStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByAccessTokenStub } = makeSut()
    jest.spyOn(loadAccountByAccessTokenStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'any_id' }))
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByAccessTokenStub } = makeSut()
    jest.spyOn(loadAccountByAccessTokenStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
