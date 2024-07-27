import { Router } from 'express'
let router = Router()

import controllers from '../controllers/controllersUsers.js'

router.get('/', controllers.register)
router.post('/', controllers.fromRegister)
router.post('/nftIo', controllers.fromLogin)
router.get('/home', controllers.home)
export default router
