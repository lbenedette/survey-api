import { AuthMiddleware } from './auth-middleware'
import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AccountModel } from '../../domain/models/account'
import { LoadAccountByToken } from '../../domain/use-cases/load-account-by-token'
import { HttpRequest } from '../protocols'

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

const makeSut = (): sutTypes => {
  const loadAccountByAccessTokenStub = makeLoadAccountByAccessToken()
  const sut = new AuthMiddleware(loadAccountByAccessTokenStub)
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
    const { sut, loadAccountByAccessTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByAccessTokenStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
