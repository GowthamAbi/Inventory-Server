import express from 'express'
import authControll from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router=express.Router()

router.post('/register',authControll.Register)
router.post('/login',authControll.login)

export default router