import { responseError } from "../error/responseError.js";
import {validate} from "../validation/validaton.js"
import { prismaClient } from "../application/database.js";
import { addOrderValidation } from "../validation/orderValidation.js";
import axios from "axios";
import fs from 'fs'
import puppeteer from "puppeteer";
import mustache from "mustache"
import serviceUtils from "./serviceUtils.js";

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

const getPdf = async (req,transaction_id) => {
 
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
        if(!order) {
            throw new responseError(404,"order not found")
        }
        await serviceUtils.createQrcode(req,transaction_id)
        const tanggal =  order.update_At.toString().split(" ")

  
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const data = {
          order : order,
          product : order.product_order,
          date : `${tanggal[0]} ${tanggal[1]} ${tanggal[2]} ${tanggal[3]} ${tanggal[4]}`,
          recipt : `http://localhost:3000/qrcode/qrcode-${req}.png`
        }
       
        await page.setContent(mustache.render(html, data));
        const height = await page.$("html")
        const heightPage = await height.boundingBox()
        const heightReal = heightPage.height + 100
       
        await page.pdf({ width : "125mm",path : fullPath,height : heightReal+'px'});
      
        page.close();
        browser.close();

        return "succes"
}

const cekStruk = async (order_id,transaction_id) => {
    const order = await prismaClient.order.findUnique({
        where : {
            id_order : order_id
        }
    })

    if(!order || order.transaction_id != transaction_id) {
        throw new responseError(400,"This receipt is not from our side")
    }

    return "This receipt does come from our website"
} 


export default {
    addOrder,
    updateStatus,
    getPdf,
    cekStruk
}

