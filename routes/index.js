import { Router } from 'express'
const router = Router()
import users from './users.js'
import posts from './post.js'

router.use('/', users)
router.use('/', posts)
export default router
