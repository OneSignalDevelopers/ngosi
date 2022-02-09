import {object,string} from "yup"

export const validateEmail = object({
    email:string().email('must be a valid email').required()
})