import { validate } from "../validation/validaton.js";
import { alamatValidation } from "../validation/alamatValidation.js";
import { prismaClient } from "../application/database.js";

const update = async (user,req) => {
    req = await validate(alamatValidation,req)

    const findUser = await prismaClient.users.findUnique({
        where : {
            email : user.email
        },
        select : {
            alamat_id : true
        }
    })

    return prismaClient.alamat.update({
        where : {
            id : findUser.alamat_id
        },
        data : req
    })

}

export default {update}