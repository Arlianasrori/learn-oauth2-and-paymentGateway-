import express from "express"
import { update } from "../controller/alamatController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

export const alamatRouter = express.Router()

alamatRouter.put("/alamat",authMiddleware,update)