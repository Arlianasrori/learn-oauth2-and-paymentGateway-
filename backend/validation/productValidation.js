import joi from "joi"

export const addProductValidation = joi.object({
    nama_product: joi.string().max(255).required(),
    deks : joi.string().max(400).optional(),
    price : joi.number().positive().required(),
    category : joi.string().max(200).required(),
    stok : joi.number().positive().required()

})
export const updateProductValidation = joi.object({
    nama_product: joi.string().max(255).optional(),
    deks : joi.string().max(400).optional(),
    price : joi.number().positive().optional(),
    category : joi.string().max(200).optional(),
    stok : joi.number().positive().optional()

})