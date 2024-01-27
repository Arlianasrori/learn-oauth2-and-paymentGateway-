import { responseError } from "../error/responseError.js";
import {validate} from "../validation/validaton.js"
import { prismaClient } from "../application/database.js";
import { addNotifValidation, getNotifValidation } from "../validation/notificationValidation.js";

const add = async (req) => {
    req = await validate(addNotifValidation,req)
    return prismaClient.notification.create({
        data : req
    })
}
const get = async (req) => {
   req = await validate(getNotifValidation,req)
   console.log(req);
   const notif = await prismaClient.notification.findMany({
    where : {
        OR : [
            {
                user_email : req
            },
            {
                user_email : null
            }
        ]
    }
   })
   if(!notif){
    return "notif is empty"
   }
   return notif
}
const getType = async (req,user) => {
    req = await validate(getNotifValidation,req)
    const notif = await prismaClient.notification.findMany({
        where : {
                    AND : [
                        {
                            OR : [
                                {
                                    user_email : user
                                },
                                {
                                    user_email : null
                                }
                            ]
                        },
                        {
                            type : req
                        }
                    ]
                }
    })
    if(!notif[0]){
        return "notif is empty"
    }
    return notif
}

export default {
    add,
    get,
    getType
}