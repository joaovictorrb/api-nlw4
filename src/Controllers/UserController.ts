import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { User } from '../Models/User'

class UserController {
  async create( request: Request, response: Response ) {
    const { name, email } = request.body
    const usersRepository = getRepository(User)

    const userAlredyExists = await usersRepository.findOne({
      email
    })

    if(userAlredyExists) {
      return response.status(400).json({
        error: "User alredy exists!"
      })
    }

    const user = usersRepository.create({
      name, 
      email
    })

    await usersRepository.save(user)
    
    return response.send()
  }
}

export { UserController}