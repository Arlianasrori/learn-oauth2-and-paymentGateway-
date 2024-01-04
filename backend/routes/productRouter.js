import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { add, update } from "../controller/productController.js"

export const productRouter = express.Router()

productRouter.post("/product/add",authMiddleware,add)
productRouter.put("/product/update/:identify",authMiddleware,update)