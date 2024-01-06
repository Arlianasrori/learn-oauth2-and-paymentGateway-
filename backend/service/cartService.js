import { responseError } from "../error/responseError.js";
import {validate} from "../validation/validaton.js"
import { prismaClient } from "../application/database.js";
import { addCartValidation, updateCountValidation } from "../validation/cartValidation.js";
import serviceUtils from "./serviceUtils.js";

const addCart = async (body,owner) => {
    body = await validate(addCartValidation,body)
    body.owner = owner

    const product = await prismaClient.product.findUnique({
        where : {
            id : body.id_product
        }
    })

    if(!product){
        throw new responseError(404,"product is not found")
    }

    body.price = body.count * product.price

    return prismaClient.cart.create({
        data : body
    })
} 

const updateCount = async (id,count,user) => {
    count = await validate(updateCountValidation,count)
    id = await validate(updateCountValidation,id)

    await serviceUtils.checkAccesCart(id,user)

    const product = await prismaClient.product.findUnique({
        where : {
            id : exist.id_product
        }
    })

    return prismaClient.cart.update({
        where : {
            id : id
        },
        data : {
            count : count,
            price : count * product.price
        }
    })
}

const deleteCart = async (id,user) => {
    id = await validate(updateCountValidation,id)

    await serviceUtils.checkAccesCart(id,user)

    return prismaClient.cart.delete({
        where : {
            id : id
        }
    })
}

const getUser = async (user) => {
    const cart = await prismaClient.cart.findMany({
        where : {
            owner : user.email
        }
    })

    if(!cart[0]){
        return "data cart is empty"
    }

    return cart
}

export default {
    addCart,
    updateCount,
    deleteCart,
    getUser
}