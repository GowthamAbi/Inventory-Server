import express from 'express'
import fabricController from '../../controllers/Fabric/fabricController.js'

const fabric=express.Router()

fabric.post('/inward',fabricController.Inward)
fabric.get('/list',fabricController.List)
fabric.get('/cuttinglist',fabricController.Cutting)
fabric.post('/selection',fabricController.Selection)
fabric.post('/outward',fabricController.Outward)
fabric.post('/outward',fabricController.Cutting)
fabric.post('/print/1',fabricController.Fabric)
fabric.post('/print/2',fabricController.CuttingList)


export default fabric