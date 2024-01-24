import { sendOtp } from "../application/nodemailer.js";
import RandomString from "randomstring"
import { redisOtp } from "../application/redisOtp.js";

export const sendOtpToUser = (email) => {
    const otp = RandomString.generate({
        length : 4,
        charset: ['numeric']
    })
    sendOtp.sendMail({
            from: 'bil furniture', 
            to:email,
            subject: "bil furniture otp",
            html: `verify your account with the code <b>${otp}</b><br>the code expire after 5 menit`         
    })
    redisOtp.setEx(email,5 * 60,otp)
}