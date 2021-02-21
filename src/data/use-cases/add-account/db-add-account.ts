import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Encryptor } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encryptor: Encryptor
  private readonly addAccountRepository: AddAccountRepository

  constructor (encryptor: Encryptor, addAccountRepository: AddAccountRepository) {
    this.encryptor = encryptor
    this.addAccountRepository = addAccountRepository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encryptor.encrypt(accountData.password)
    await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    // @ts-expect-error
    return await new Promise(resolve => resolve({}))
  }
}
