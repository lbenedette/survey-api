import { HttpRequest, HttpResponse, Middleware, LoadAccountByToken } from './auth-middleware-protocols'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { Role } from '../../domain/models/role'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByAccessToken: LoadAccountByToken, private readonly role?: Role) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountByAccessToken.load(accessToken, this.role)
        if (account) {
          return ok({ accountId: account.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
