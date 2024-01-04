
import { responseError } from "../error/responseError.js";

 const errorMiddleware = (err,req,res,next) => {
    if(err instanceof responseError){
        return res.status(err.status).json({
            msg : err.message
        })
    }
    return res.status(500).json({
        msg : err.message
    })
}

export default {
    errorMiddleware
}