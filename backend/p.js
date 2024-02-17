import fs from 'fs'
import puppeteer from 'puppeteer'
import mustache from "mustache"

const browser = await puppeteer.launch();
const page = await browser.newPage();

const htmlBody = fs.readFileSync('template.html', 'utf-8');
const data = {
  nomor: 112,
  tanggal: '21 September 2020',
  alamat: 'Bogor, Jawa Barat',
  pembayaran: [{ metode: 'Tunai', jumlah: 'Rp2.000.000' }],
  barang: [
    { item: 'nVidia GeForce 3090 RTX', harga: 'Rp1.000.000' },
    { item: 'AMD Ryzen 7', harga: 'Rp1.000.000' },
  ],
  total: 'Rp2.000.000',
};

await page.setContent(mustache.render(htmlBody, data));
const pdf = await page.pdf({ format: 'A4',path : "./invoice.pdf" });

page.close();
browser.close();