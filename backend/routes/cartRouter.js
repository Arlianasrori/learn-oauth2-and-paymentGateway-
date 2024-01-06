import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { add, deleteCart, getUser, updateCount } from "../controller/cartController.js"

export const cartRouter = express.Router()

cartRouter.post("/cart/add",authMiddleware,add)
cartRouter.put("/cart/updateCount/:identify",authMiddleware,updateCount)
cartRouter.delete("/cart/delete/:identify",authMiddleware,deleteCart)
cartRouter.get("/cart",authMiddleware,getUser)