import { prismaClient } from "../application/database.js"

export const verifyLoginMiddleware = async (req,res,next) => {
    const body = req.body
    const user = await prismaClient.users.findUnique({
        where : {
            email : body.email
        }
    })
    if(!user){
        return res.status(400).json({
            msg : "email or password wrong"
        })
    }
    if(!user.verify){
        return res.status(400).json({
            msg : "email or password wrong"
        })
    }
    next()
}