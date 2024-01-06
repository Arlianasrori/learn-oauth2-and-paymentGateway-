import productService from "../service/productService.js"

export const add = async (req,res,next) => {
    try {
        const user = req.user
        const body = req.body
        const file = req.files
        const url = `${req.protocol}://${req.get("host")}/images/`
    
        const result = await productService.add(body,user,file,url)
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
    
        const result = await productService.getProductById(identify)
        
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
        const result = await productService.getAllProduct()
        
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