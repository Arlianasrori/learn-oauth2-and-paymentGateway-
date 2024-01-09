import orderService from "../service/orderService.js";

export const add = async (req,res,next) => {
    try {
        const user = req.user
        const order_detail = req.body.order_detail
        const productOrder = req.body.productOrder
        const idOrder = req.body.idOrder

        const result = await orderService.addOrder(order_detail,user,idOrder,productOrder)

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
        const status = req.body.status
        const result = await orderService.updateStatus(status,id_order)

        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
