import express from 'express'
import fabricController from '../../controllers/Fabric/fabricController.js'

const fabric=express.Router()

fabric.post('/inward',fabricController.Inward)
fabric.post('/selection',fabricController.Selection)
fabric.get('/selection',fabricController.Selection)

export default fabric