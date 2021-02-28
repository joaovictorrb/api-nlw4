import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";

class NpsController {

  /*
  *
  * 1 2 3 4 5 6 7 8 9 10
  * Detractors 1-6
  * Liabilities 7-8 NOT NEEDED
  * Promoters 9-10
  * (AmountPromoters - AmountDetractors) / (AmountAnswers)
  */

  async execute(request: Request, response: Response) {
    const { survey_id } = request.params
    const surveyUserRepository = getCustomRepository(SurveyUserRepository)

    const surveyUser = await surveyUserRepository.find({
      survey_id, value: Not(IsNull())
    })

    const detractor = surveyUser.filter(
      (survey) => survey.value >= 0 && survey.value <= 6 
    ).length

    const promoter = surveyUser.filter(
      (survey) => survey.value >=9 && survey.value <= 10
    ).length

    const totalAnswers = surveyUser.length

    const result = ((promoter - detractor) / (totalAnswers)).toFixed(2)

    return response.json({
      detractor,
      promoter,
      totalAnswers,
      nps: result
    })
  }
}

export { NpsController }