import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { add, getPdf, updateStatus } from "../controller/orderController.js"

export const orderRouter = express.Router()

orderRouter.post('/order/add',add)
orderRouter.post('/order/status/:id_order',updateStatus)
orderRouter.get('/order/getPdf',getPdf)
