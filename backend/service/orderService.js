import { responseError } from "../error/responseError.js";
import {validate} from "../validation/validaton.js"
import { prismaClient } from "../application/database.js";
import { addOrderValidation } from "../validation/orderValidation.js";

const addProductOrder = async (id_order,product) => {
    const count = 0
    const price = 0

    product.forEach(async (product) => {
        const result = await prismaClient.product_order.create({
            data : product
        })
        count += result.jumlah
        price += result.price
    });

    return {count,price}
}


const addOrder = async(body,user,id_order,product) => {
    body = await validate(addOrderValidation,body)
    body.id = id_order
    body.email_customer = user.email

    const addOrder = await prismaClient.order.create({
        data : body
    })

    const product_order = await addProductOrder(id_order,product)

    return prismaClient.order.update({
        where : {
            id_order : addOrder.id_order
        },
        data : {
            jumlah_product : product_order.count,
            price : product_order.price
        }
    })

}
const updateStatus = async(status,id_order) => {
    return prismaClient.order.update({
        where : {
            id_order : id_order
        },
        data : {
            status : status
        }
    })

}

export default {
    addOrder,
    updateStatus
}

