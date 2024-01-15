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
import { corsMiddleware } from "../middleware/corsMiddleware.js"


export const app = express()

dotenv.config()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended : true}))
app.use(fileUpload())
app.use(express.static("public"))
app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Method', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    next()
})
app.use(orderRouter)
app.use(userRoute)
app.use(alamatRouter)
app.use(productRouter)
app.use(cartRouter)
app.use(paymentRouter)

app.use(errMiddleware.errorMiddleware)
