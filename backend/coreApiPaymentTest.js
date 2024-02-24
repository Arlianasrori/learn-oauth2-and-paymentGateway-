import axios from "axios"
const auth = btoa(`${process.env.PAYMENT_SERVER_KEY} :`)
console.log(auth);

const {data} = await axios("https://api.sandbox.midtrans.com/v2/charge",{
    method : "POST",
    headers : {
        Authorization : `Basic U0ItTWlkLXNlcnZlci1FamVlckdpcXhXMXU1SEEzWUl6dzZDanEgOg==`,
        "Accept" : "application/json",
        "Content-Type" : "application/json"
    },
    data : {
        "payment_type": "bank_transfer",
        "transaction_details": {
            "order_id": "order-92",
            "gross_amount": 44000
        },
        "bank_transfer":{
            "bank": "bca"
        },
        "custom_expiry": {
            "expiry_duration": 60,
            "unit": "minute"
        }
    }
})
// const {data} = await axios(`https://api.sandbox.midtrans.com/v2/order-90/cancel`,{
//     method : "POST",
//     headers : {
//         Authorization : `Basic U0ItTWlkLXNlcnZlci1FamVlckdpcXhXMXU1SEEzWUl6dzZDanEgOg==`,
//         "Accept" : "application/json",
//         "Content-Type" : "application/json"
//     }
// })

// const {data} = await axios("https://api.sandbox.midtrans.com/v2/order-91/status",{
//     method : "GET",
//     headers : {
//         Authorization : `Basic U0ItTWlkLXNlcnZlci1FamVlckdpcXhXMXU1SEEzWUl6dzZDanEgOg==`,
//         "Accept" : "application/json",
//         "Content-Type" : "application/json"
//     }
// })
console.log(data);
