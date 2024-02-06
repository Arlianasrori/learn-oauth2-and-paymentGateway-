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
    let options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
        header: {
            height: "45mm",
            contents: `<h1 style="text-align: center;">Bil furniture</h1>
            <p style="text-align: center;font-size: 22px;">www.bilFutniture.com</p>
            <div style="width: 100%; height: 0; border: 2px dashed black;"></div>`
        },
        // footer: {
        //     height: "28mm",
        //     contents: {
        //         first: 1,
        //         2: 2, 
        //         default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        //         last: 'Last Page'
        //     }
        // }
    };
    const order = await prismaClient.order.findUnique({
        where : {
            id_order : "order-6212"
        },
        select : {
          id_order : true,
          email_customer : true,
          kode_pos : true,
          payment_using : true,   
          jumlah_product : true,
          product_order : {
            select : {
                product : true,
                jumlah : true,
                price : true
            }
          },
          customer : true,
          update_At : true
        }
    })
    console.log(order);
    var users = [
        {
          name: "Shyam",
          age: "26",
        },
        {
          name: "Navjot",
          age: "26",
        },
        {
          name: "Vitthal",
          age: "26",
        },
      ];

    let document = {
        html: html,
        data: {
          users : users,
          order : order,
          product : order.product_order
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

