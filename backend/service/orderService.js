import { responseError } from "../error/responseError.js";
import {validate} from "../validation/validaton.js"
import { prismaClient } from "../application/database.js";
import { addOrderValidation } from "../validation/orderValidation.js";

const addProductOrder = async (id_order,) => {

}


const addOrder = async(body,user,id) => {
    body = await validate(addOrderValidation,body)
    body.id = id

    const addOrder = await prismaClient.order.create({
        data : body
    })

}