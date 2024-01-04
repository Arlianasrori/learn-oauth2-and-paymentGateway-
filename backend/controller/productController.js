import productService from "../service/productService.js"

export const add = async (req,res,next) => {
    try {
        const user = req.user
        const body = req.body
        const images = req.file
        console.log(user);
        console.log(body);
        console.log(images);
        res.send("hay")

        // const result =await productService.add(body,user,images)
        // res.status(200).json({
        //     data : result
        // })
    } catch (error) {
        next(error)
    }
}
export const update = async (req,res,next) => {
    try {
        const body = req.body
        // const images = req.file.path
        const identify = req.params.identify
        console.log(user);
        console.log(body);
        // console.log(images);
        res.send("hay")

        // const result =await productService.update(identify,body,images)
        // res.status(200).json({
        //     data : result
        // })
    } catch (error) {
        next(error)
    }
}