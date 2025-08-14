import {z} from "zod";


export const messageValidation=z.object({
    content:z
    .string()
    .min(10,"content should be atleast 10 characters")
    .max(300,"content should be at max 300 characters")
    

})