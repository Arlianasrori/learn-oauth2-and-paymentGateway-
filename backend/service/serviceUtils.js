import fs from "fs"
import { prismaClient } from "../application/database.js"
import { responseError } from "../error/responseError.js"
const addFile = async (file,imageUrl) => {
    const nameFile = new Date().getTime() + "-" + file.images.name
    imageUrl = imageUrl + nameFile
    await file.images.mv(`./public/images/${nameFile}`)
    return imageUrl
}
const deleteFile = async (image) => {
    const dest = "public/" + "images/" + image.split("/")[4]
    await fs.unlink(dest, (err) => {
        if (err) {
          throw new responseError(500,err.message)
        }
    });
}
const checkAccesCart = async (id,user) => {
    const exist = await prismaClient.cart.findUnique({
        where : {
            id : id
        }
    })

    if(!exist){
        throw new responseError(404,"cart is not found")
    }
   
    if(user.email !== exist.owner){
        throw new responseError(403,"you do not have access to access this basket")
    }
}
export default {
    addFile,
    deleteFile,
    checkAccesCart
}