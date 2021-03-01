import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Hasher, LoadAccountByEmailRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly addAccountRepository: AddAccountRepository
  ) {
  }

  async add (accountData: AddAccountModel): Promise<AccountModel | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (!account) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      return await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    }
    return null
  }
}
