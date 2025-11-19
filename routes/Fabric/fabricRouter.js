import express from 'express'
import fabricController from '../../controllers/Fabric/fabricController.js'

const fabric=express.Router()

fabric.post('/inward',fabricController.Inward)
fabric.get('/list',fabricController.List)
fabric.post('/selection',fabricController.Selection)
fabric.post('/outward',fabricController.Outward)
fabric.get('/outward',fabricController.Cutting)


export default fabric