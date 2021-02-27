import { Router } from 'express'
import { UserController } from './controllers/UserController'
import { SurveyController } from './controllers/SurveyController'
const router = Router()
const userController = new UserController()
const surveyController = new SurveyController()

router.get('/users', userController.show)
router.post('/users', userController.create)

router.get('/survey', surveyController.show)
router.post('/survey', surveyController.create)


export { router }