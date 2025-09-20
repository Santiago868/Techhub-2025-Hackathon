import {z } from "zod";
import { organizationSchema } from "./orgScehma";


export const userSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    username: z.string().min(2).max(100).optional(),
    interests: z.array(z.string()).min(1).max(10).optional(),
    manages_orgs: z.array(organizationSchema).optional(),
    events_attending: z.array(z.union([z.string(), z.any()])).optional(), // Can be UUIDs or full event objects
    points: z.int().min(0).optional(),
});

export type UserSchemaType = z.infer<typeof userSchema>;