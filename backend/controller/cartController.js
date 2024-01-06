import cartService from "../service/cartService.js";

export const add = async (req,res,next) => {
    try {
        const {email} = req.user
        const body = req.body
        console.log(body);

        const result = await cartService.addCart(body,email)

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
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
export const getUser =async (req,res,next) => {
    try {
        const user = req.user

        const result = await cartService.getUser(user)
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}