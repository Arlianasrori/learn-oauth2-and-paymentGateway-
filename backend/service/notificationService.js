import { responseError } from "../error/responseError.js";
import {validate} from "../validation/validaton.js"
import { prismaClient } from "../application/database.js";
import { addNotifValidation, getNotifValidation } from "../validation/notificationValidation.js";

const add = async (req) => {
    req = await validate(addNotifValidation,req)
    const notif = await prismaClient.notification.create({
        data : req
    })
    return notif
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
    },
    select : {
        id : true,
        title :true,
        type : true,
        user_email : true,
        notificationRead : {
            where : {
                user_email : req
            },
            select : {
                notification_id : true,
                isread : true
            }
        }
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
                },
                select : {
                    id : true,
                    title :true,
                    type : true,
                    user_email : true,
                    notificationRead : {
                        where : {
                            user_email : user
                        },
                        select : {
                            notification_id : true,
                            isread : true
                        }
                    }
                }
    })
    if(!notif[0]){
        return "notif is empty"
    }
    return notif
}
const read = async (req,user) => {
    const notification_id = req
    const isNotif = await prismaClient.notification.findUnique({
        where :{
            id : notification_id
        }
    })
    if(!isNotif){
        throw new responseError(400,"notif is not found")
    }
    const notifRead = await prismaClient.notificationRead.create({
        data : {
            notification_id : notification_id,
            user_email : user,           
            isread : true
        }
    })

    return notifRead
}
const count = async (user) => {
    const countNotifNotRead = await prismaClient.notification.findMany({
        where : {        
                    OR : [
                        {
                            user_email : user
                        },
                        {
                            user_email : null
                        }
                    ]    
        },
        select : {
            id : true,
            title : true,
            detail : true,
            type : true,
            notificationRead : {
                where : {
                    user_email : user,
                }
            }
        }
    })
    console.log(countNotifNotRead);
    return countNotifNotRead
}

export default {
    add,
    get,
    getType,
    read,
    count
}