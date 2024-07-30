import { Router } from 'express'
let router = Router()

import controllers from '../controllers/controllersPost.js'
router.get('/post', controllers.post)
router.post('/createPost', controllers.createPost)
router.get('/getTasks', controllers.getTasks)
router.get('/getSinglePost', controllers.getSinglePost)
export default router
