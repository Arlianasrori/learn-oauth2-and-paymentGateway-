import { responseError } from "../error/responseError.js";
import {validate} from "../validation/validaton.js"
import { prismaClient } from "../application/database.js";
import { addProductValidation, updateProductValidation,getProductByIdentifyValidation, searchProductValidation } from "../validation/productValidation.js";
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

const deleteProduct = async (req) => {
    req = await validate(getProductByIdentifyValidation,req)

    const product = await prismaClient.product.findUnique({
        where : {
            id : req
        }
    })

    if(!product){
        throw new responseError(404,"product is not found")
    }

    const deleteProduct = await prismaClient.product.delete({
        where : {
            id : req
        }
    })

    serviceUtils.deleteFile(product.img)

    return deleteProduct
}

const getProductById = async (req) => {
    req = await validate(getProductByIdentifyValidation,req)

    const product = await prismaClient.product.findUnique({
        where : {
            id : req
        }
    })

    if(!product){
        throw new responseError(404,"product is not found")
    }

    return product
}
const getAllProduct = async () => {
    const product = await prismaClient.product.findMany({
    })

    if(!product[0]){
       return "product is empty"
    }

    return product
}

const searchProduct = async(body) => {
    body = await validate(searchProductValidation,body)

    const product = await prismaClient.product.findMany({
        where : {
            OR : [
                {
                    nama_product : {
                        contains : body.nama_product
                    }
                },
                {
                    category : {
                        contains : body.category
                    }
                },
                {
                    sold_by : {
                        contains : body.sold_by
                    }
                },
                {
                    price : body.price
                },
            ]
        }
    })

    if(!product){
        throw new responseError(404,"product is not found")
    }

    return product
}

export default {
    add,
    update,
    getProductById,
    getAllProduct,
    deleteProduct,
    searchProduct
}