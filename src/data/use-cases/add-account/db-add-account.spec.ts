import { DbAddAccount } from './db-add-account'
import { Encryptor } from '../../protocols/encryptor'

interface sutTypes {
  sut: DbAddAccount
  encryptorStub: Encryptor
}

const makeEncryptor = (): Encryptor => {
  class EncryptorStub implements Encryptor {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncryptorStub()
}

const makeSut = (): sutTypes => {
  const encryptorStub = makeEncryptor()
  const sut = new DbAddAccount(encryptorStub)
  return {
    sut,
    encryptorStub
  }
}

describe('DbAddAccount UseCase', () => {
  test('Should call Encryptor with correct password', async () => {
    const { sut, encryptorStub } = makeSut()
    const encryptSpy = jest.spyOn(encryptorStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encryptor throws', async () => {
    const { sut, encryptorStub } = makeSut()
    jest.spyOn(encryptorStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})
