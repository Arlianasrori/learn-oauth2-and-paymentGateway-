import path from "path";
import orderService from "../service/orderService.js";
import path1 from "path"

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
        const result = await orderService.updateStatus(body,id_order)

        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
export const getPdf = async (req,res,next) => {
    try {
        const order_id = req.params.order_id
        const transaction_id = req.body.transaction_id

        const result = await orderService.getPdf(order_id,transaction_id)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
export const download = async (req,res,next) => {
    const path = "/Users/ACER/Desktop/learn-oauth2-and-paymentGateway-/backend" + "/public" + "/pdf" + "/" + req.params.fileName
    ;
    res.download(path,(err) => {
        if(err) {
            res.status(500).json({
                msg : err
            })
        }
    })
}

export const cekStruk = async (req,res,next) => {
    try {
        const orderId = req.query.o
        const transaction_id = req.query.t
        console.log(orderId);

        const result = await orderService.cekStruk(orderId,transaction_id)
        res.status(200).json({
            msg : "succes"
        })
    } catch (error) {
        next(error)
    }
}
