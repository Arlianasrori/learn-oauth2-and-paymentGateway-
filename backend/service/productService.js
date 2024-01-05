import { responseError } from "../error/responseError.js";
import {validate} from "../validation/validaton.js"
import { prismaClient } from "../application/database.js";
import { addProductValidation, updateProductValidation } from "../validation/productValidation.js";
import serviceUtils from "./serviceUtils.js";




const add = async (req,user,file,imageUrl) => {
    req = await validate(addProductValidation,req)

    if(file && imageUrl){
        const addFile = await serviceUtils.addFile(file,imageUrl)
        req.img = addFile
    }

    req.sold_by = user.email

    return prismaClient.product.create({
        data : req
    })
}

const update = async (req,data,file,imageUrl) => {
    data = await validate(updateProductValidation,data)
    const product = await prismaClient.product.findUnique({
        where : {
            id : req
        }
    })

    if(!product){
        throw new responseError(404,"product is not found")
    }


    if(file && imageUrl){
        const addFile = await serviceUtils.addFile(file,imageUrl)
        data.img = addFile

        if(product.img){
            await serviceUtils.deleteFile(product.img)
        }
    }

    const productUpdate = await prismaClient.product.update({
        where : {
            id : req
        },
        data : data
    })

    return productUpdate

}

export default {
    add,
    update
}