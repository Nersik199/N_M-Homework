import { Router } from 'express'
let router = Router()

import controllers from '../controllers/controllersPost.js'
router.get('/post', controllers.post)
router.post('/createPost', controllers.createPost)
router.get('/allPost', controllers.getTasks)

export default router
