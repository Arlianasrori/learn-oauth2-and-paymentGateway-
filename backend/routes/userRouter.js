import express from "express"
import { getAllUser, getSpesifikUser, login, loginWithGoogle,sendOtpUlang, loginWithGoogleCallback, logout, register, searchUser, toBeSeller, updateUser, verifyOtp } from "../controller/userController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { updateStatus } from "../controller/orderController.js"
import { verifyLoginMiddleware } from "../middleware/verifyLoginMiddleware.js"


export const userRoute = express.Router()

userRoute.get("/users",getAllUser)
userRoute.get("/user/:identify",getSpesifikUser)
userRoute.get("/users/search/:identify",searchUser)
userRoute.post("/users/register",register)
userRoute.post("/users/sendOtp",sendOtpUlang)
userRoute.post("/users/login",verifyLoginMiddleware,login)
userRoute.post("/users/logout",authMiddleware,logout)
userRoute.put("/users",authMiddleware,updateUser)
userRoute.post("/user/seller",authMiddleware,toBeSeller)
userRoute.post("/user/verify",verifyOtp)
userRoute.get("/auth/google",loginWithGoogle)
userRoute.get("/auth/google/callback",loginWithGoogleCallback)



