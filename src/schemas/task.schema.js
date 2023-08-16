import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string({
        required_error: "Title is required",
    }),
    description: z.string({
        required_error:"Description must be a string",
    }),
   // }).optional(), // Error
    date: z.string().datetime().optional(),
});