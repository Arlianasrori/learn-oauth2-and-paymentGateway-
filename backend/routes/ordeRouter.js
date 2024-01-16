import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { add, updateStatus } from "../controller/orderController.js"

export const orderRouter = express.Router()

orderRouter.post('/order/status/:id_order',updateStatus)
orderRouter.post('/j',(req,res) => {
    console.log("ahy");
    console.log(req.body);
    res.send("hay")
})
orderRouter.post('/order/add',add)
