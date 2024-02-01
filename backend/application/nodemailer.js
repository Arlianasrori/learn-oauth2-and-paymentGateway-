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
//     from: 'bil furniture', // sender address
//     to: "arlianasrori@gmail.com", // list of receivers
//     subject: "bil furniture otp", // Subject line
//     html: "<b>Hello world?</b>", // html body
//   });
// console.log(j);