import joi from "joi"

export const registerValidation = joi.object({
    email : joi.string().min(4).max(255).required(),
    no_hp : joi.string().max(12).required(),
    name :joi.string().min(3).max(255).required(),
    password : joi.string().max(255).required()
})
export const alamatValidation = joi.object({
    village : joi.string().optional(),
	subsidtrick : joi.string().optional(),
	regency : joi.string().required(),
	province : joi.string().required(),
	country :joi.string().required(),
	kode_pos :joi.number().positive().required()
})
export const loginWithEmailValidation = joi.object({
    email : joi.string().min(4).max(255).required(),
    password : joi.string().max(255).required()
})
export const loginWithNoHpValidation = joi.object({
    no_hp : joi.number().positive().max(12).required(),
    password : joi.string().max(255).required()
})
export const getSpesifikUserValidation = joi.string().required()
export const updateUserValidation = joi.object({
    email : joi.string().min(4).max(255).optional(),
    no_hp : joi.string().max(12).optional(),
    name :joi.string().min(3).max(255).optional(),
    password : joi.string().max(255).optional()
})
export const toBeSellerValidation = joi.object({
    email : joi.string().min(4).max(255).required(),
    no_hp : joi.string().max(12).required(),
    password : joi.string().max(255).required()
})