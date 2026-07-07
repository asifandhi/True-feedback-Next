import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(2,"username must at least 2 characters ")
    .max(20,"username must be noe more than  20 characters ")
    .regex(/^[a-zA-Z0-9_]+$/,"username dont contain speacial character")
      
export const signUpSchema = z.object({
     username : usernameValidation,
     email : z.string().email({message:"Invalid email address"}),
     password : z.string().min(8,{message : "Pass must be more then or equal to 8 characters"})
})