import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { add, count, get, getByType, read } from "../controller/notificationController.js"

export const notifRouter = express.Router()

notifRouter.post('/notification/add',add)
notifRouter.get('/notification',authMiddleware,get)
notifRouter.get('/notification/:type',authMiddleware,getByType)
notifRouter.get('/notification/read/:notif_id',authMiddleware,read)
notifRouter.get('/notification/Get/count',authMiddleware,count)