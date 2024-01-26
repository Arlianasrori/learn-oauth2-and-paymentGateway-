import { responseError } from "../error/responseError.js";
import {validate} from "../validation/validaton.js"
import { prismaClient } from "../application/database.js";
import { addNotifValidation } from "../validation/notificationValidation.js";

const add = async (req) => {
    req = await validate(addNotifValidation,req)
}