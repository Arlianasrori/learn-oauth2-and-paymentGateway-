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
import { notifRouter } from "../routes/notificationRouter.js"
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
    methods : ["*"],
    credentials : true,
    allowedHeaders : "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept",
    origin : "http://127.0.0.1:5500",
}))
app.set("trusty proxy")
app.use(userRoute)
app.use(orderRouter)
app.use(alamatRouter)
app.use(productRouter)
app.use(cartRouter)
app.use(paymentRouter)
app.use(notifRouter)

app.use(errMiddleware.errorMiddleware)
