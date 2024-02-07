import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { add, download, getPdf, updateStatus } from "../controller/orderController.js"

export const orderRouter = express.Router()

orderRouter.post('/order/add',add)
orderRouter.post('/order/status/:id_order',updateStatus)
orderRouter.post('/order/getPdf/:order_id',getPdf)
orderRouter.get('/order/download/:fileName',download)
