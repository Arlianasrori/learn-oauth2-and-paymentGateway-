import express from "express"
import { userRoute } from "../routes/userRouter.js"
import errMiddleware from "../middleware/errMiddleware.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { alamatRouter } from "../routes/alamatRouter.js"
import { productRouter } from "../routes/productRouter.js"
import { cartRouter } from "../routes/cartRouter.js"
import { orderRouter } from "../routes/ordeRouter.js"
import { paymentRouter } from "../payment-Gateway/paymentRoutes.js"
import fileUpload from "express-fileupload"
import cors from "cors"


export const app = express()

dotenv.config()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended : true}))
app.use(fileUpload())
app.use(express.static("public"))
app.use(cors({
    origin : "*",
    allowedHeaders : "*",
    methods : "*",
    preflightContinue : "*",
}))
app.use(userRoute)
app.use(orderRouter)
app.use(alamatRouter)
app.use(productRouter)
app.use(cartRouter)
app.use(paymentRouter)

app.use(errMiddleware.errorMiddleware)
