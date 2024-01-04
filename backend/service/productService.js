import { responseError } from "../error/responseError.js";
import {validate} from "../validation/validaton.js"
import { prismaClient } from "../application/database.js";
import { addProductValidation, updateProductValidation } from "../validation/productValidation.js";

const add = async (req,user,images) => {
    req = validate(addProductValidation,req)
    req.sold_by = user.email
    req.images = images

    return prismaClient.product.create({
        data : req
    })
}

const update = async (req,data,images) => {
    data = await validate(updateProductValidation,data)
    const product = await prismaClient.product.findUnique({
        where : {
            id : req
        }
    })

    if(!product){
        throw new responseError(404,"product is not found")
    }
    data.images = images

    return prismaClient.product.update({
        where : {
            id : req
        },
        data : data
    })

}

export default {
    add,
    update
}