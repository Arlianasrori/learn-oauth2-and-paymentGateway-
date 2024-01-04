import alamatService from "../service/alamatService.js"
export const update = async (req,res,next) => {
    try {
        const user = req.user
        const data = req.body
    
        if(!data){
            return res.status(400).json({
                msg : "masukkan bidy"
            })
        }
    
        const result = await alamatService.update(user,data)
        res.status(200).json({
            msg : "succes",
            data :result
        }) 
    } catch (error) {
        next(error)
    }

}