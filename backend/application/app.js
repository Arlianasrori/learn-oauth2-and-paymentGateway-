import express from "express"
import { userRoute } from "../routes/userRouter.js"
import { alamatValidation } from "../validation/userValidation.js"
import errMiddleware from "../middleware/errMiddleware.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { alamatRouter } from "../routes/alamatRouter.js"
import multer from "multer"
import { fileStorage,fileFilter } from "../utils/multerConfig.js"
import { productRouter } from "../routes/productRouter.js"


export const app = express()

dotenv.config()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended : true}))
app.use(multer({
    storage : fileStorage,
    fileFilter : fileFilter
}).single('images'))
app.use(userRoute)
app.use(alamatRouter)
app.use(productRouter)

app.use(errMiddleware.errorMiddleware)
