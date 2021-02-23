import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { Validation } from '../../presentation/helpers/validators/validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { CompareFieldValidation } from '../../presentation/helpers/validators/compare-field-validation'

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = []
  for (const field of ['email', 'name', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
  return new ValidationComposite(validations)
}
