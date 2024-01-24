import { responseError } from "../error/responseError.js";
import { alamatValidation, getSpesifikUserValidation, loginWithEmailValidation, loginWithNoHpValidation, registerValidation, toBeSellerValidation, updateUserValidation } from "../validation/userValidation.js";
import { prismaClient } from "../application/database.js";
import jwt from "jsonwebtoken";
import {validate} from "../validation/validaton.js"
import bcrypt from "bcrypt"
import { redisOtp } from "../application/redisOtp.js";
import { registerIfNotVerify } from "./serviceUtils.js";
async function CheckAlreadyExist (result){
    const user = await prismaClient.users.findFirst({
        where : {
            OR : [
                {
                   email : result.email 
                },
                {
                   no_hp : result.no_hp 
                }
            ]
        },
        select : {
            email :true,
            password :true,
            no_hp :true,
            name : true
        }
    })

 
    if(!user){
        throw new responseError(400,'email or password wrong')
    }
    const isPassword = await bcrypt.compareSync(result.password,user.password)

    if(!isPassword){
        throw new responseError(400,"email or password wrong")
    }

    return user
} 

const register = async (user,alamat) => {
    const result = await validate(registerValidation,user)
    alamat = await validate(alamatValidation,alamat)


    const cekUser = await prismaClient.users.findUnique({
        where : {
            email : result.email
        }
    })

    if(cekUser){
        if(!cekUser.verify){
            const sult = await registerIfNotVerify(result,alamat)
    
            return sult
        }else{
            throw new responseError(400,"email already exist")
        }
    }
    result.password = await bcrypt.hashSync(result.password,11)

    const userRegister = await prismaClient.users.create({
        data : result,
        select : {
            email : true,
            no_hp : true,
            name : true,
            alamat_id : true,
            seller : true,
            refresh_token : true,
            refresh_token_seller : true
        }
    })
    alamat.id = userRegister.alamat_id
    const alamatregsiter = await prismaClient.alamat.create({
        data : alamat
    })

    return {
        user : userRegister,
        alamat : alamatregsiter
    }
}

const verifyOtp = async (req) => {
    const {email,otp} = req

    const userOtp = await redisOtp.get(email)
    const user = await prismaClient.users.findUnique({
        where : {
            email : email
        }
    })
    if(!user){
        throw new responseError(400,"invalid otp")
    }else if(user.verify){
        throw new responseError(400,"user sudah verify")
    }else{
        if(userOtp != JSON.parse(otp)) {
            console.log("hay");
            throw new responseError(400,"invalid otp")
        }
        await prismaClient.users.update({
            where : {
                email : email
            },
            data : {
                verify : true
            }
        })
        return "verify succes"
    }
}
const login = async (req) => {
    let result;
    if(req.email){
        result = await validate(loginWithEmailValidation,req)
    }else if(req.no_hp){
        result = await validate(loginWithNoHpValidation,req)
    }

    const user =  await CheckAlreadyExist(result)


    const accestoken = jwt.sign(user,process.env.SECRET_KEY,{expiresIn : "40d"})
    const refreshtoken = jwt.sign(user,process.env.SECRET_REFRESH_TOKEN,{expiresIn : "90d"})

    await prismaClient.users.update({
        where : {
            email : user.email
        },
        data : {
            refresh_token : refreshtoken
        }
    })
    return {accestoken,refreshtoken}
    
}

const loginWithGoogle = async (user) => {
    const checkUser = await prismaClient.users.findUnique({
        where : {
            email : user.email
        },
        select : {
            email :true,
            password :true,
            no_hp :true,
            name : true
        }
    })

    if(!checkUser){
        return {accestoken : undefined}
    }

    const accestoken = jwt.sign(checkUser,process.env.SECRET_KEY,{expiresIn : "30d"})
    const refreshtoken = jwt.sign(checkUser,process.env.SECRET_REFRESH_TOKEN,{expiresIn : "90d"})

    await prismaClient.users.update({
        where : {
            email : checkUser.email
        },
        data : {
            refresh_token : refreshtoken
        }
    })

    return {accestoken,refreshtoken}
}

const getallUser = async () => {
    const user = await prismaClient.users.findMany({
        select : {
            email : true,
            no_hp : true,
            name : true,
            alamat : true,
            seller : true,
            refresh_token : true,
            refresh_token_seller : true
        },       
    })

    if(!user[0]){
        return "data user is empty"
    }

    return user
}

const getSpesifikUser = async (req) => {
    req = await validate(getSpesifikUserValidation,req)

    const user = await prismaClient.users.findFirst({
        where: {
            OR : [
                {
                    email : req
                },
                {
                    no_hp : req
                }
            ]
        }
    })

    if(!user){
        throw new responseError(404,"user is not found")
    }

    return user
}

const searchUser = async (req,page) => {
    req = await validate(getSpesifikUserValidation,req)
    
    const user = await prismaClient.users.findMany({
        skip : (page - 1) * 10,
        take : 20,
        where : {
            OR : [
                {
                    name : {
                        contains : req
                    }
                },
                {
                    email : {
                        contains : req
                    }
                },
                {
                    no_hp : {
                        contains : req
                    }
                },
                {
                    alamat : {
                        OR : [
                            {
                                village : {
                                    contains : req
                                },
                            },
                            {
                                subsidtrick : {
                                    contains : req
                                },
                            },
                            {
                                regency : {
                                    contains : req
                                },
                            },
                            {
                                province : {
                                    contains : req
                                },
                            },
                            {
                                country : {
                                    contains : req
                                },
                            }
                        ]
                    }
                }
            ]
        },
        select : {
            name :true,
            no_hp : true,
            seller :true,
            alamat : true,
            product:  true
        }
    })

    if(!user[0]){
        throw new responseError(404,"user is not found")
    }

    return user
}

const updateUser = async (user,data) => {
    data = await validate(updateUserValidation,data)

    const isUser = await prismaClient.users.findFirst({
        where : {
            email : user.email
        }
    })

    if(!isUser){
        throw new responseError(401,"unauthrize")
    }

    const check = await prismaClient.users.findFirst({
        where : {
            OR : [
                {
                    email : data.email
                },
                {
                    no_hp : data.no_hp
                },
            ]
        }
    })


    if(check){
        if(data.email == check.email || data.no_hp == check.no_hp){
            throw new responseError(400,"already exist")
        }
    }

    const update = await prismaClient.users.update({
        where : {
            email : user.email
        },
        data : data,
        select : {
            email : true,
            password : true,
            name :true,
            no_hp : true,
            seller :true,
            alamat : true,
            product:  true
        }
    })
    const forToken = {
        email : update.email,
        password : update.password,
        name : update.name
    }
    const token = await jwt.sign(forToken,process.env.SECRET_KEY)
    return {
        token : token
    }


}

const toBeSeller = async (req) => {
    req = await validate(toBeSellerValidation,req)

    const users = await CheckAlreadyExist(req)
    const token = jwt.sign(users,process.env.SECRET_KEY_SELLER,{
        expiresIn : "30d"
    })
    const refresh_token = jwt.sign(users,process.env.SECRET_REFRESH_KEY_TOKEN,{
        expiresIn : "90d"
    })

    await prismaClient.users.update({
        where : {
            email: users.email
        },
        data : {
            refresh_token_seller : refresh_token
        }
    })

    return {token: token,refresh_token_seller : refresh_token}
}

export default {
    register,
    login,
    getallUser,
    getSpesifikUser,
    searchUser,
    updateUser,
    toBeSeller,
    loginWithGoogle,
    verifyOtp
}