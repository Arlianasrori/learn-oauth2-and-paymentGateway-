import joi from "joi"

export const addNotifValidation = joi.object({
    title : joi.string().max(255).required(),
    detail : joi.string().max(5000).required(),
    type : joi.string().required(),
    user_email : joi.string().max(255).optional()
})
export const getNotifValidation = joi.string().max(255).required()
