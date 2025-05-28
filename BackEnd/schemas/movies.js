import { z } from 'zod';

const movieSchema = z.object({
  name: z.string().max(60), // 'title' → 'name'
  fecha: z.string()
    .refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid date"
    })
    .transform(val => new Date(val)), // sigue siendo útil
  description: z.string().max(700).default(null).optional().nullable(),
  duration: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: "Duration must be in HH:mm or HH:mm:ss format"
  }),
  likes: z.number().int().min(0).optional().nullable().default(null),
  dislikes: z.number().int().min(0).optional().nullable().default(null), // 'notLikes' → 'dislikes'
  movie: z.string().url({ message: 'Movie must be a valid URL' }),
  user_id: z.string().uuid() // 'user' → 'user_id'
});

export function validateMovie(object) {
  return movieSchema.safeParse(object);
}

export function validatePartialMovie(object) {
  return movieSchema.partial().safeParse(object);
}
