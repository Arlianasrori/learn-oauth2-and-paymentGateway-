import fs from "fs"
const addFile = async (file,imageUrl) => {
    const nameFile = new Date().getTime() + "-" + file.images.name
    imageUrl = imageUrl + nameFile
    await file.images.mv(`./public/images/${nameFile}`)
    return imageUrl
}
const deleteFile = async (image) => {
    const dest = "public/" + "images/" + image.split("/")[4]
    await fs.unlink(dest, (err) => {
        if (err) {
          throw new responseError(500,err.message)
        }
    });
}

export default {
    addFile,
    deleteFile
}