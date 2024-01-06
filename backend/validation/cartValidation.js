import joi from "joi"

export const addCartValidation = joi.object({
    id_product : joi.number().positive(255).required(),
    count : joi.number().positive().required().default(1).optional()
})
export const updateCountValidation = joi.number().positive()