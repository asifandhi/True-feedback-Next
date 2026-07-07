import {z} from 'zod'
export const messageSchema = z.object({
    content : z.string().min(10,{message :"Content must at least 10 character"}).max(300,{message:"content must under 300 character "})
})