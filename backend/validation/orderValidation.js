import joi from "joi"

export const addOrderValidation = joi.object({
    id_order : joi.string().max(255).required(),
    payment_using : joi.string().max(255).required(),
    alamat_jalan : joi.string().max(255).optional(),
    alamat_village : joi.string().max(255).optional(),
    alamat_subsidtrick : joi.string().max(255).optional(),
    alamat_regency : joi.string().max(255).required(),
    alamat_province : joi.string().max(255).required(),
    country : joi.string().max(255).required(),
    kode_pos : joi.number().required()
})