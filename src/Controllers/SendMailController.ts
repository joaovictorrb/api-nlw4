import { Request, Response } from 'express'
import { resolve } from 'path'
import { getCustomRepository } from 'typeorm'
import { AppError } from '../errors/AppError'
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

    if(!user) throw new AppError('User does not exists!')
    //return response.status(400).json({error: ""})

    const survey = await surveyRepository.findOne({id: survey_id})

    if(!survey) throw new AppError('Survey does not exists!')
    //return response.status(400).json({error: ""})

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