import { Router } from 'express'
let router = Router()

import controllers from '../controllers/controllersUsers.js'
import cheekToken from '../middleware/cheekToken.js'
router.get('/', controllers.register)
router.get('/home', controllers.home)
router.post('/register', controllers.fromRegister)
router.post('/login', controllers.fromLogin)
router.get('/getUsersList', cheekToken, controllers.getUsersList)
router.get('/getUserProfile', controllers.getUserProfile)
router.get('/updateUserProfile', controllers.updateUser)
router.put('/updateUserProfile', controllers.updateUserProfile)
export default router
