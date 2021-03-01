import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { LogMongoRepository } from '../../../../infra/db/mongodb/log/log-mongo-repository'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbAuthentication } from '../../use-cases/db-authentication-factory'
import { makeDbAddAccount } from '../../use-cases/db-add-account-factory'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(makeDbAddAccount(), makeDbAuthentication(), makeSignUpValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
