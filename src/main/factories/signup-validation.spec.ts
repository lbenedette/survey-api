import { makeSignUpValidation } from './signup-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation('email'),
      new RequiredFieldValidation('name'),
      new RequiredFieldValidation('password'),
      new RequiredFieldValidation('passwordConfirmation')
    ])
  })
})
