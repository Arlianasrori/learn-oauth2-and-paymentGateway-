import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { authSellerMiddleware } from "../middleware/authSellerMiddleware.js"
import { add, deleteProduct, getAllProduct, getProductById, searchProduct, update } from "../controller/productController.js"

export const productRouter = express.Router()

productRouter.get("/product/:identify",authMiddleware,getProductById)
productRouter.get("/products",authMiddleware,getAllProduct)
productRouter.get("/products/search",authMiddleware,searchProduct)
productRouter.post("/product/add",authSellerMiddleware,add)
productRouter.put("/product/update/:identify",authSellerMiddleware,update)
productRouter.delete("/product/delete/:identify",authSellerMiddleware,deleteProduct)