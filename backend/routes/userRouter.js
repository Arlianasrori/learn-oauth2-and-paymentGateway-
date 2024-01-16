import express from "express"
import { getAllUser, getSpesifikUser, login, loginWithGoogle, loginWithGoogleCallback, logout, register, searchUser, toBeSeller, updateUser } from "../controller/userController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { updateStatus } from "../controller/orderController.js"



export const userRoute = express.Router()

userRoute.post("njing/:id_order",updateStatus)
userRoute.get("/users",getAllUser)
userRoute.get("/user/:identify",getSpesifikUser)
userRoute.get("/users/search/:identify",searchUser)
userRoute.post("/users/register",register)
userRoute.post("/users/login",login)
userRoute.post("/users/logout",authMiddleware,logout)
userRoute.put("/users",authMiddleware,updateUser)
userRoute.post("/user/seller",authMiddleware,toBeSeller)
userRoute.get("/auth/google",loginWithGoogle)
userRoute.get("/auth/google/callback",loginWithGoogleCallback)



