"use client"

import { z } from "zod"

const formSchema = z.object({
    email: z.string().min(5).max(100).email('Invalid email address'),
    password: z.string().min(8).max(100).nonempty('Password is required'),
})

export type FormSchemaType = z.infer<typeof formSchema>