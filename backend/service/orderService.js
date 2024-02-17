import { responseError } from "../error/responseError.js";
import {validate} from "../validation/validaton.js"
import { prismaClient } from "../application/database.js";
import { addOrderValidation } from "../validation/orderValidation.js";
import axios from "axios";
import pdf from "pdf-creator-node"
import fs from 'fs'
import puppeteer from "puppeteer";
import mustache from "mustache"

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
    await axios({
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

const getPdf = async (req,date) => {
        let pathFile = "./public/pdf"
        let fileName = `${req}.pdf`

        let fullPath = pathFile + '/' + fileName
        let html = fs.readFileSync("./template.html","utf-8").toString()
        const order = await prismaClient.order.findUnique({
            where : {
                id_order : req
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
            total_price : true,
            customer : true,
            alamat_jalan : true,
            alamat_regency : true,
            alamat_province : true,
            update_At : true
            }
        })
        const tanggal =  order.update_At.toString().split(" ")
        console.log(tanggal);

  
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const data = {
          order : order,
          product : order.product_order,
          date : tanggal
        }
        console.log(data.product.product);
        await page.setContent(mustache.render(html, data));
        await page.pdf({ format: 'A6',path : fullPath});
      
        page.close();
        browser.close();
        return "succes"
}



export default {
    addOrder,
    updateStatus,
    getPdf
}

