import  {z} from "zod";

export const usernameValidation=z
    .string()
    .min(2,"Username should be of atleast 2 characters")
    .max(20,"username should be of at max 20 characters")
    .regex(/^[a-zA-Z0-_]+$/,"Username should be valid");


export const signUpSchema=z.object({
    username:usernameValidation,
    email:z.email({message:"email should be valid"}),
    password:z.string().min(6,{message:"Password should be of atleast 6 characters"})
})
