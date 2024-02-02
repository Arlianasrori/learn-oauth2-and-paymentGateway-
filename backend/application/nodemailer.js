import nodemailer from "nodemailer"

export const sendOtp = nodemailer.createTransport({
  service : "gmail",
  host: "arlianasrori@gmail.com",
  auth: {
    user: "arlianasrori@gmail.com",
    pass: "ilfz mfhx ahkx jnyo",
  },
});

sendOtp.verify((err,succes) => {
  if(err){
    console.log(err);
  }else{
    console.log(succes);
  }
})

// const j = await sendOtp.sendMail({
//     fl: "<b>Helloworld?</b>", // html body
//   });rom: 'bil furniture', // sender address
//     to: "arlianasrori@gmail.com", // list of receivers
//     subject: "bil furniture otp", // Subject line
//     htm 
// console.log(j);