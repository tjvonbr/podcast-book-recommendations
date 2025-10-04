import z from "zod";

export const spotifyQuerySchema = z.object({
  query: z.string().min(2).max(50),
})