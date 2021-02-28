import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { UsersRepository } from '../repositories/UsersRepository'
import * as yup from 'yup'
import { AppError } from '../errors/AppError'

class UserController {
  async create( request: Request, response: Response ) {
    const { name, email } = request.body

    const schema = yup.object().shape({
      name: yup.string().required('Name is required!'),
      email: yup.string().email().required('Email is not valid / is required!')
    })

    if(!(await schema.isValid(request.body, {abortEarly: false}))) throw new AppError('Validation failed!')
    //return response.status(400).json({error: ""})

    /* try {
      await schema.validate(request.body)
    } catch (err) {
      return response.status(400).json({error: err})
    } */

    const usersRepository = await getCustomRepository(UsersRepository)

    const userAlredyExists = await usersRepository.findOne({
      email
    })

    if(userAlredyExists) throw new AppError('User alredy exists!') 
    //return response.status(400).json({error: "User alredy exists!"})

    const user = usersRepository.create({
      name, 
      email
    })

    await usersRepository.save(user)
    
    return response.status(201).json(user)
  }

  async show ( request: Request, response: Response ) {
    const usersRepository = await getCustomRepository(UsersRepository)

    const all = await usersRepository.find()

    return response.json(all)
  }
}

export { UserController}