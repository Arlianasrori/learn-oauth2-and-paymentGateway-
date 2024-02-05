import { responseError } from "../error/responseError.js";
import {validate} from "../validation/validaton.js"
import { prismaClient } from "../application/database.js";
import { addOrderValidation } from "../validation/orderValidation.js";
import axios from "axios";
import pdf from "pdf-creator-node"
import fs from "fs"

const addProductOrder = async (id_order,product,tx) => {
    let count = 0
    let price = 0
  
    for (let index = 0; index < product.length; index++) {   
        const result = await tx.product_order.create({
            data : {
                id_product : product[index].id,
                id_order : id_order,
                jumlah : product[index].quantity,
                price : product[index].price
            }
        })
       
        count = count + result.jumlah
        price = price + result.price        
    }

    return {count,price}
}


const addOrder = async(body,user,product) => {
    body = await validate(addOrderValidation,body)
    body.email_customer = "aabiljr@gmail.com"
    
    return prismaClient.$transaction(async (tx) => {
        const addOrder = await tx.order.create({
            data : body
        })

        const product_order = await addProductOrder(addOrder.id_order,product,tx)
        return tx.order.update({
            where : {
                id_order : addOrder.id_order
            },
            data : {
                jumlah_product : product_order.count,
                total_price : product_order.price
            },
            select : {
                id_order : true,
                customer : {
                    select : {
                        email : true,
                        no_hp : true                   
                    }
                },
                alamat_jalan : true,
                alamat_village : true,
                alamat_subsidtrick : true,
                alamat_regency : true,
                alamat_province : true,
                country : true,
                kode_pos : true,
                product_order : true,
                jumlah_product : true,
                total_price : true,
                status : true          
            }
        })
    })



}
const updateStatus = async(body,id_order) => {
    const statusUpdate = await prismaClient.order.update({
        where : {
            id_order : id_order
        },
        data : body
    })
    console.log("hay");
    const notif = await axios({
        method : "POST",
        url : "http://localhost:3000/notification/add",
        headers : {
            "Accept" : "application/json",
            "Content-Type" : "application/json",
        },
        data : {
            "title" : "info",
            "detail" : `order is ${statusUpdate.status} payment using : ${statusUpdate.payment_using} jumlah product : ${statusUpdate.jumlah_product} total harga : ${statusUpdate.total_price} waktu : ${statusUpdate.update_At}`,
            "type" : "info",
            "user_email" : statusUpdate.email_customer
        }
    })

    return statusUpdate

}

const getPdf = async (req) => {
    let pathFile = "./public/pdf"
    let fileName = "order.pdf"
    let fullPath = pathFile + '/' + fileName
    let html = fs.readFileSync("./template.html","utf-8").toString()
    console.log(html);
    let options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
        header: {
            height: "45mm",
            contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
        },
        footer: {
            height: "28mm",
            contents: {
                first: 'Cover page',
                2: 'Second page', // Any page number is working. 1-based index
                default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                last: 'Last Page'
            }
        }
    };
    let users = [
        {
            order_id : 1,
            name : "hay bro"
        },
        {
            order_id : 2,
            name : "hay bro"
        }
      ];
    let document = {
        html: html,
        data: {
          orders: users,
        },
        path: fullPath,
        type: "",
      };
    let process = await pdf.create(document,options)
    return "hay"
}

export default {
    addOrder,
    updateStatus,
    getPdf
}

