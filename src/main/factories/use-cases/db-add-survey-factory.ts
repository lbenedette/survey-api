import { SurveyMongoRepository } from '../../../infra/db/mongodb/survey/survey-mongo-repository'
import { DbAddSurvey } from '../../../data/use-cases/add-survey/db-add-survey'
import { AddSurvey } from '../../../domain/use-cases/add-survey'

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbAddSurvey(surveyMongoRepository)
}
