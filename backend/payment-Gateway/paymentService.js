import Randomstring from "randomstring"

import axios from "axios"

const payment = async (body,user) => {

    const idOrder = `order-${Randomstring.generate({
        length : 4,
        charset: ['numeric']
    })}`
    
    body.transaction_details.order_id = idOrder
    const auth = btoa(`${process.env.PAYMENT_SERVER_KEY} :`)

    const response = await axios({
        method : "post",
        url : "https://app.sandbox.midtrans.com/snap/v1/transactions",
        headers : {
            "Accept" : "application/json",
            "Content-Type" : "application/json",
            "Authorization" : `Basic ${auth}`
        },
        data : body
    })

    body.order_detail.id_order = idOrder
    await axios({
        method : "post",
        url : "http://localhost:3000/order/add",
        data : body
    })

    return response.data
}

export {
    payment
}