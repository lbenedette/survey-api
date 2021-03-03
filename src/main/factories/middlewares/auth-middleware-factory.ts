import { Middleware } from '../../../presentation/protocols'
import { AuthMiddleware } from '../../../presentation/middlewares/auth-middleware'
import { makeDbLoadAccountByToken } from '../use-cases/db-load-account-by-token-factory'
import { Role } from '../../../domain/models/role'

export const makeAuthMiddleware = (role?: Role): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role)
}
