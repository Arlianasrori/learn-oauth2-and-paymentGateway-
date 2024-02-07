import { prismaClient } from "../application/database.js";
import userService from "../service/userService.js";
import { authUrl,oauth2Client } from "../oauth/oauth.js";
import {google} from "googleapis"
import jwt from "jsonwebtoken"
import { redisClient } from "../cache/redisClient.js";
import { sendOtpToUser } from "./controllerUtils.js";
import { responseError } from "../error/responseError.js";



export const register = async (req,res,next) => {
    try {
        const user = req.body.users
        const alamat = req.body.alamat

        const googleToken = req.cookies.google_token
        if(googleToken){
            await jwt.verify(googleToken,process.env.SECRET_GOOGLE_KEY,(err,decode) => {
                if(!err){
                    user.email = decode.email,
                    user.name = decode.name
                }
            })
        }
        
        const result = await userService.register(user,alamat)
 
        const allUserCache = JSON.parse( await redisClient.get("getAllUser"))

        if(allUserCache){
            allUserCache.push(result)
            redisClient.setEx(`getAllUser`,60 * 60 * 60,JSON.stringify(allUserCache))
        }

       sendOtpToUser(user.email)

        res.status(201).json({
            msg : "succes",
            data : result,
            messsge : "verify your account"
        })
    } catch (error) {
        next(error)
    }
}

export const verifyOtp = async (req,res,next) => {
    try {
        const body = req.body
      
        const result = await userService.verifyOtp(body)
  
        res.status(200).json({
             msg : result
        })
    } catch (error) {
        next(error)
    }
}
export const sendOtpUlang = async (req,res,next) => {
    try {
        const body = req.body.email   
        const user = await prismaClient.users.findUnique({
            where : {
                email : body
            }
        })
     
        if(!user){
            throw new responseError(400,"user not found")
        }
        if(user.verify){
            throw new responseError(400,"user already verified")
        }   
        sendOtpToUser(body)
        res.status(200).json({
             msg : "send otp succes"
        })
    } catch (error) {
        next(error)
    }
}
export const login = async (req,res,next) => {
    try {
        const body = req.body
        const result = await userService.login(body)
  
        res.status(200).cookie("acces_token",result.accestoken,{
                maxAge : 24 * 60 * 60 * 60,
                httpOnly: true,
                sameSite: 'None',
                secure: true
        }).json({
                acces_token : result.accestoken,
                refresh_token : result.refreshtoken
        })
    } catch (error) {
        next(error)
    }
}

export const loginWithGoogle = (req,res,next) => {
    try {
        res.redirect(authUrl)
    } catch (error) {
        next(error)
    }
}
export const loginWithGoogleCallback = async (req,res,next) => {
    try {
        const {code} = req.query
        const {tokens} = await oauth2Client.getToken(code)
        oauth2Client.setCredentials(tokens)

        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version : "v2"
        })

        const {data} = await oauth2.userinfo.get()
        console.log(data);
        const result = await userService.loginWithGoogle(data)

        if(!result.accestoken){
            const googleToken = jwt.sign(data,process.env.SECRET_GOOGLE_KEY,{expiresIn : "1h"})
            return res.cookie("google_token",googleToken,{
                maxAge : 60 * 1000 * 60,
                httpOnly : true,
                domain: 'http://127.0.0.1:5500',
                sameSite:'None',
            }).send("hay")
        }

        res.status(200).cookie("acces_token",result.accestoken,{
            maxAge : 24 * 60 * 60 * 60,
            httpOnly : true,
            
        }).json({
                acces_token : result.accestoken,
                refresh_token : result.refreshtoken
        })
        

    } catch (error) {
        next(error)
    }
}


export const logout = async (req,res,next) => {
    try {
        res.status(200).clearCookie('acces_token').json({
            msg : "logout succes",
            data :"ok"
        })
    } catch (error) {
        next(error)
    }
}

export const getAllUser = async (req,res,next) => {
    try {
        const allUserCache = JSON.parse(await redisClient.get("getAllUser"))
     
        if(allUserCache) {
            console.log("from cache");
            return res.status(200).json({
                msg : "succes",
                data : allUserCache
            })
        }else{
            const result = await userService.getallUser()
            redisClient.setEx(`getAllUser`,60 * 60 * 60,JSON.stringify(result))
            res.status(200).json({
                msg : "succes",
                data : result
            })
        }
    } catch (error) {
        next(error)
    }
}
export const getSpesifikUser = async (req,res,next) => {
    try {
        const identify = req.params.identify
        const userCache = JSON.parse(await redisClient.get(`user:${identify}`))

        if(userCache){
            console.log("from cache");
            return  res.status(200).json({
                msg : "succes",
                data : userCache
            })
        }else{
            const result = await userService.getSpesifikUser(identify)
            redisClient.setEx(`user:${identify}`,60 * 60 * 60,JSON.stringify(result))
    
            res.status(200).json({
                msg : "succes",
                data : result
            })
        }
    } catch (error) {
        next(error)
    }
}
export const searchUser = async (req,res,next) => {
    try {
        const identify = req.params.identify
        const {page} = req.body

        if(!identify){
            return res.status(400).json({
                msg : "masukkan kriteria user"
            })
        }
        const result =await userService.searchUser(identify,page)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
export const updateUser = async (req,res,next) => {
    try {
        const user = req.user
        const data = req.body
        const result = await userService.updateUser(user,data)
        redisClient.del(`user:${result.email}`)
        redisClient.del(`user:${result.no_hp}`)
        redisClient.del("getAllUser")
     
        res.status(200).cookie("acces_token",result.token,{
            maxAge : 24 * 60 * 60 * 60,
            httpOnly : true,
        }).json({
            msg : "succes",
            data : "ok"
        })
    } catch (error) {
        next(error)
    }
}
export const toBeSeller = async (req,res,next) => {

    try {
        const data = req.body
        const result = await userService.toBeSeller(data)
     
        res.status(200).cookie("acces_seller_token",result.token,{
            maxAge : 24 * 60 * 60 * 60,
            httpOnly : true,
        }).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}


