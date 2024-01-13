
import { payment } from "./paymentService.js";

export const paymentController = async (req,res,next) => {
    try {
        const user = req.user
        const body = req.body
        console.log(body);
        const result = await payment(body,user)

        res.status(200).json({
            data : result
        })
    } catch (error) {
       next(error) 
    }
}