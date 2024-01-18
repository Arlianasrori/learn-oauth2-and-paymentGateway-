import { redisClient } from "../cache/redisClient.js";
import cartService from "../service/cartService.js";

export const add = async (req,res,next) => {
    try {
        const {email} = req.user
        const body = req.body
        console.log(body);

        const result = await cartService.addCart(body,email)
        const cartCache = JSON.parse( await redisClient.get(`cart:${email}`))

        if(allUserCache){
            cartCache.push(result)
            redisClient.set(`cart:${email}`,JSON.stringify(cartCache))
        }

        res.status(201).json({
            msg : "ok",
            data : result
        })
    } catch (error) {
        next(error)
    }
}

export const updateCount =async (req,res,next) => {
    try {
        const identify = req.params.identify
        const count = req.body.count
        const user = req.user

        const result = await cartService.updateCount(identify,count,user)
        redisClient.del(`cart:${identify}`)
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
export const deleteCart =async (req,res,next) => {
    try {
        const identify = req.params.identify
        const user = req.user

        const result = await cartService.deleteCart(identify,user)
        redisClient.del(`cart:${identify}`)
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
export const getCart =async (req,res,next) => {
    try {
        const user = req.user
        const cartCache = JSON.parse(await redisClient.get(`cart:${user.email}`))

        if(cartCache){
            console.log("from cache");
            return res.status(200).json({
                msg : "succes",
                data : cartCache
            })
        }

        const result = await cartService.getCart(user)
        redisClient.set(`cart:${user.email}`,JSON.stringify(result))
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}