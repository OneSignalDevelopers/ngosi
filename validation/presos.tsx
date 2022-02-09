import { object, string } from "yup"

export const validatePresos = object({
    url: string().url().required(),
    eventName: string().required(),
    title: string(),
    eventLocation:string()
})