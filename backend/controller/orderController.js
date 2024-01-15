import orderService from "../service/orderService.js";

export const add = async (req,res,next) => {
    try {
        const user = req.user
        const order_detail = req.body.order_detail
        const productOrder = req.body.item_details

        const result = await orderService.addOrder(order_detail,user,productOrder)

        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
export const updateStatus = async (req,res,next) => {
    try {
        const id_order = req.params.id_order
        const body = req.body
        console.log(id_order,body);
        const result = await orderService.updateStatus(body,id_order)

        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
