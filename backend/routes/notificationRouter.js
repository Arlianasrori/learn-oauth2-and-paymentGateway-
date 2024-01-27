import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { add, get, getByType } from "../controller/notificationController.js"

export const notifRouter = express.Router()

notifRouter.post('/notification/add',add)
notifRouter.get('/notification',authMiddleware,get)
notifRouter.get('/notification/:type',authMiddleware,getByType)