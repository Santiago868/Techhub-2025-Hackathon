import { z } from 'zod';
export const organizationSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  causes: z.array(z.string()),
  location: z.string(),
  sponsoring: z.array(z.any()),
});

export type Organization = z.infer<typeof organizationSchema>;
