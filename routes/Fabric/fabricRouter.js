import express from 'express'
import fabricController from '../../controllers/Fabric/fabricController.js'

const fabric=express.Router()

fabric.post('/inward',fabricController.Inward)
fabric.post('/outward',fabricController.Outward)
fabric.get('/balance',fabricController.Balance)

export default fabric