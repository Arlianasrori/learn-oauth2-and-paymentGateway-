export const corsMiddleware = (req,res,next) => {
    res.setheader('Access-Control-Allow-Origin','*')
    res.setheader('Access-Control-Allow-Methods','GET','POST','PUT','PATCH')
    res.setheader('Access-Control-Allow-Headers','Content-Type,Authorization')
    next()
}