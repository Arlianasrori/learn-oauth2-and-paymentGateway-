import { prismaClient } from "../application/database.js";
import userService from "../service/userService.js";
import { authUrl,oauth2Client } from "../oauth/oauth.js";
import {google} from "googleapis"
import jwt from "jsonwebtoken"

export const register = async (req,res,next) => {
    try {
        const user = {
            email : req.body.email,
            no_hp : req.body.no_hp,
            name : req.body.name,
            password : req.body.password,

        }
        const alamat = {
            village : req.body.village,
            subsidtrick : req.body.subsidtrick,
            regency : req.body.regency,
            province : req.body.province,
            country :req.body.country,
            kode_pos :req.body.kode_pos
        }

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
        res.status(201).json({
            msg : "succes",
            data : result
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
                httpOnly : true,
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
        const result = await userService.loginWithGoogle(data)

        if(!result.accestoken){
            const googleToken = jwt.sign(data,process.env.SECRET_GOOGLE_KEY,{expiresIn : "1h"})
            console.log(googleToken);
            return res.cookie("google_token",googleToken,{
                maxAge : 60 * 1000 * 60,
                httpOnly : true,
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
        const result =await userService.getallUser()
        console.log(req.cookies);

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
export const getSpesifikUser = async (req,res,next) => {
    try {
        const identify = req.params.identify

        if(!identify){
            return res.status(400).json({
                msg : "masukkan kriteria user"
            })
        }
        const result =await userService.getSpesifikUser(identify)

        res.status(200).json({
            msg : "succes",
            data : result
        })
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


