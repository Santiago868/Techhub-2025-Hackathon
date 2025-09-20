import {z } from "zod";

export const userSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    username: z.string().min(2).max(100).optional(),
    interests: z.array(z.string()).min(1).max(10).optional(),
});

export type UserSchemaType = z.infer<typeof userSchema>;