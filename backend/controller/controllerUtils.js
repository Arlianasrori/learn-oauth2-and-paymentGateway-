import { sendOtp } from "../application/nodemailer.js";
import RandomString from "randomstring"
import { redisOtp } from "../application/redisOtp.js";

export const sendOtpToUser = (email) => {
    console.log(email);
    const otp = RandomString.generate({
        length : 4,
        charset: ['numeric']
    })
    sendOtp.sendMail({
            from: 'bil furniture', 
            to:email,
            subject: "bil furniture otp",
            html: `verify your account with the code <b>${otp}</b>`         
    })
    redisOtp.set(email,otp)
}