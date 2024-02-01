import productService from "../service/productService.js"
import { redisClient } from "../cache/redisClient.js"

export const add = async (req,res,next) => {
    try {
        const user = req.user
        const body = req.body
        const file = req.files
        const url = `${req.protocol}://${req.get("host")}/images/`
    
        const result = await productService.add(body,user,file,url)

        const allUserCache = JSON.parse( await redisClient.get("allProducts"))
        
        if(allUserCache){
            allUserCache.push(result)
            redisClient.set(`allProducts`,JSON.stringify(allUserCache))
        }
        res.status(200).json({
            data : result
        })
    } catch (error) {
        next(error)
    }
}


export const update = async (req,res,next) => {
    try {
        const body = req.body
        const file = req.files
        const identify = parseInt(req.params.identify) 
        const url = `${req.protocol}://${req.get("host")}/images/`

        const result = await productService.update(identify,body,file,url)
        redisClient.del(`product:${identify}`)
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
export const deleteProduct = async(req,res,next) => {   
    try {
        const identify = parseInt(req.params.identify)
    
        const result = await productService.deleteProduct(identify)
        redisClient.del(`product:${identify}`)
        
        res.status(200).json({
            msg : "ok",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
export const getProductById = async(req,res,next) => {   
    try {
        const identify = parseInt(req.params.identify)
        const productCache = JSON.parse(await redisClient.get(`product:${identify}`))
        
        if(productCache) {
            console.log("from cache");
            return  res.status(200).json({
                msg : "ok",
                data : productCache
            })
        }
        const result = await productService.getProductById(identify)
        redisClient.set(`product:${identify}`,JSON.stringify(result))
        
        res.status(200).json({
            msg : "ok",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
export const getAllProduct = async(req,res,next) => {   
    try {   
        const productCache = JSON.parse(await redisClient.get(`allProducts`))
        
        if(productCache) {
            console.log("from cache");
            return  res.status(200).json({
                msg : "ok",
                data : productCache
            })
        }
        const result = await productService.getAllProduct()
        redisClient.set(`allProducts`,JSON.stringify(result))
        
        res.status(200).json({
            msg : "ok",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
export const searchProduct = async(req,res,next) => {
    try {
        
        const body = req.body
    
        const result = await productService.searchProduct(body)

        res.status(200).json({
            msg : "ok",
            data : result
        })
        
    } catch (error) {
        next(error)
    }
}