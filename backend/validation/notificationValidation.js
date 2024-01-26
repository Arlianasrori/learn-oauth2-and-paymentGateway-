import joi from "joi"

export const addNotifValidation = joi.object({
    user_email  : joi.string().max(255).required(),
    title : joi.string().max(255).required(),
    detail : joi.string().max(5000).required(),
})