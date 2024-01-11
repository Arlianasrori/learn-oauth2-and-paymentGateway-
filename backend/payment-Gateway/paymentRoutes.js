import express from "express"
import { paymentController } from "./paymentController.js"

export const paymentRouter = express.Router()

paymentRouter.post("/paymentGateway",paymentController)