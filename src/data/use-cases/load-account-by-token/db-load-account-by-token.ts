import { LoadAccountByToken } from '../../../domain/use-cases/load-account-by-token'
import { AccountModel } from '../../../domain/models/account'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'
import { Role } from '../../../domain/models/role'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly decrypter: Decrypter, private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository) {
  }

  async load (accessToken: string, role?: Role): Promise<AccountModel | null> {
    const token = await this.decrypter.decrypt(accessToken)
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
      if (account) {
        return account
      }
    }
    return null
  }
}
