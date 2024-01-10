import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { add, updateStatus } from "../controller/orderController.js"

export const orderRouter = express.Router()

orderRouter.post('/order/add',add)
orderRouter.patch('/order/status/:id_order',authMiddleware,updateStatus)