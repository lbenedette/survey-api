import { HttpRequest, HttpResponse, Middleware } from '../protocols'
import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { LoadAccountByToken } from '../../domain/use-cases/load-account-by-token'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByAccessToken: LoadAccountByToken) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (accessToken) {
      await this.loadAccountByAccessToken.load(accessToken)
    }
    return forbidden(new AccessDeniedError())
  }
}
