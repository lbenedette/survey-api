import { AddSurvey, AddSurveyModel } from '../../../domain/use-cases/add-survey'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurveyRepository) {
  }

  async add (data: AddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(data)
  }
}
