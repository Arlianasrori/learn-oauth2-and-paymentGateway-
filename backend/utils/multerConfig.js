import multer from "multer"
export const fileStorage = multer.diskStorage({
    destination : (req,res,cb) => {
        cb(null,"../public/images")
    },
    filename : (req,file,cb) => {
        cb(null,new Date().toString() + "-" + file.originalUrl)
    }
})

export const fileFilter =(req,files,cb) => {
    if(files.mimetype == "image/png" || files.mimetype == "image/jpg" || files.mimetype == "image/jpeg"){
        cb(null,true)
    }else{
        cb(null,false)
    }
}