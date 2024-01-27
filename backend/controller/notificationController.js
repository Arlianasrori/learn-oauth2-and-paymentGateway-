import notificationService from "../service/notificationService.js";

export const add = async (req,res,next) => {
    try {
        const data = req.body

        const result = await notificationService.add(data)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
export const get = async (req,res,next) => {
    try {
        const data = req.user.email

        const result = await notificationService.get(data)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
export const getByType = async (req,res,next) => {
    try {
        const type = req.params.type
        const user = req.user.email
        console.log(user);

        const result = await notificationService.getType(type,user)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}