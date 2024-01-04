import joi from "joi";
export const alamatValidation = joi.object({
    village : joi.string().optional(),
	subsidtrick : joi.string().optional(),
	regency : joi.string().optional(),
	province : joi.string().optional(),
	country :joi.string().optional(),
	kode_pos :joi.number().positive().optional()
})