import joi from "joi"

export const addCartValidation = joi.object({
    id : joi.number().positive(255).required,
    count : joi.number().positive().required().default(1)
})