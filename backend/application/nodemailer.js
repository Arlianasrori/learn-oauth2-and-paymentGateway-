import nodemailer from "nodemailer"

const sendOtp = nodemailer.createTransport({
  service : "gmail",
  host: "arlianasrori@gmail.com",
  auth: {
    user: "arlianasrori@gmail.com",
    pass: "ilfz mfhx ahkx jnyo",
  },
});

await sendOtp.sendMail({
    from: 'bil furniture', // sender address
    to: "aabiljr@gmail.com", // list of receivers
    subject: "bil furniture otp", // Subject line
    html: "<b>Hello world?</b>", // html body
  });
