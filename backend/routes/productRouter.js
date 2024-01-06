import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { add, deleteProduct, getAllProduct, getProductById, searchProduct, update } from "../controller/productController.js"

export const productRouter = express.Router()

productRouter.get("/product/:identify",authMiddleware,getProductById)
productRouter.get("/products",authMiddleware,getAllProduct)
productRouter.get("/products/search",authMiddleware,searchProduct)
productRouter.post("/product/add",authMiddleware,add)
productRouter.put("/product/update/:identify",authMiddleware,update)
productRouter.delete("/product/delete/:identify",authMiddleware,deleteProduct)