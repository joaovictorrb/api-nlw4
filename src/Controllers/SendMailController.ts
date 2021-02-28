import { Request, Response } from 'express'
import { resolve } from 'path'
import { getCustomRepository } from 'typeorm'
import { SurveyRepository } from '../repositories/SurveyRepository'
import { SurveyUserRepository } from '../repositories/SurveyUserRepository'
import { UsersRepository } from '../repositories/UsersRepository'
import SendMailService from '../services/SendMailService'

class SendMailController {
  async execute(request: Request, response: Response) {
    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')

    const { email, survey_id } = request.body

    const userRepository = getCustomRepository(UsersRepository)
    const surveyRepository = getCustomRepository(SurveyRepository)
    const surveyUserRepository = getCustomRepository(SurveyUserRepository)

    const user = await userRepository.findOne({email})

    if(!user) return response.status(400).json({error: "User does not exists!"})

    const survey = await surveyRepository.findOne({id: survey_id})

    if(!survey)  return response.status(400).json({error: "Survey does not exists!"})

    const surveyUserExists = await surveyUserRepository.findOne({
      where: [{user_id: user.id}, {value: null}],
      relations: ["user", "survey"]
    })

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: "",
      link: process.env.URL_MAIL_LOCAL
    }

    if(surveyUserExists) {
      variables.id = surveyUserExists.id
      await SendMailService.execute(email, survey.title, variables, npsPath)
      return response.json(surveyUserExists)
    }

    //Save data from survey
    const surveyUser = surveyUserRepository.create({
      user_id: user.id,
      survey_id
    })
    await surveyUserRepository.save(surveyUser)

    //Send Email to user    
    variables.id = surveyUser.id
    await SendMailService.execute( email, survey.title ,variables, npsPath )
    return response.json(surveyUser)
  }


}

export { SendMailController }