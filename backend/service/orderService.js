import { responseError } from "../error/responseError.js";
import {validate} from "../validation/validaton.js"
import { prismaClient } from "../application/database.js";
import { addOrderValidation } from "../validation/orderValidation.js";

const addProductOrder = async (id_order,product) => {
    let count = 0
    let price = 0

    for (let index = 0; index < product.length; index++) {      
        product[index].id_order = id_order

        const result = await prismaClient.product_order.create({
            data : product[index]
        })
        count = count + result.jumlah
        price = price + result.price        
    }

    return {count,price}
}


const addOrder = async(body,user,product) => {
    body = await validate(addOrderValidation,body)
    body.email_customer = user.email

    const addOrder = await prismaClient.order.create({
        data : body
    })

    const product_order = await addProductOrder(body.id_order,product)

    return prismaClient.order.update({
        where : {
            id_order : addOrder.id_order
        },
        data : {
            jumlah_product : product_order.count,
            total_price : product_order.price
        },
        select : {
            id_order : true,
            customer : {
                select : {
                    email : true,
                    no_hp : true                   
                }
            },
            alamat_jalan : true,
            alamat_village : true,
            alamat_subsidtrick : true,
            alamat_regency : true,
            alamat_province : true,
            country : true,
            kode_pos : true,
            product_order : true,
            jumlah_product : true,
            total_price : true,
            status : true          
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

