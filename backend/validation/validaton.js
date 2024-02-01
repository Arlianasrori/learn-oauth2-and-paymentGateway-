import { responseError } from "../error/responseError.js"

export const validate = async (schema,obj) => {
    const result = await schema.validate(obj)

    if(result.error){
        throw new responseError(400,result.error.message)
       
    }

    return result.value
}