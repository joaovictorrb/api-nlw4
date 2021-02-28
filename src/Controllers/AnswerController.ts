import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";

class AnswerController {

  //http://localhost:3333/answers/ SCORE ?u= IDSURVEY
  async execute(request: Request, response: Response) {
    const { score } = request.params
    const { u } = request.query

    const surveyUserRepository = getCustomRepository(SurveyUserRepository)

    const surveyUser = await surveyUserRepository.findOne({
      id: String(u)
    })

    if(!surveyUser) return response.status(400).json({error: "Survey user does not exists!"})

    surveyUser.value = Number(score)

    await surveyUserRepository.save(surveyUser)

    return response.status(200).json(surveyUser)
  }
}

export { AnswerController }