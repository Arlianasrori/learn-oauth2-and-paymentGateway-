
import { payment } from "./paymentService.js";

export const paymentController = async (req,res,next) => {
    try {
        const user = req.user
        const body = req.body
     
        const result = await payment(body,user)

        res.status(200).cookie("hay","hay",{
            maxAge : 24 * 60 * 60 * 60,
            httpOnly : true,
        }).json({
            data : result
        })
    } catch (error) {
       next(error) 
    }
}