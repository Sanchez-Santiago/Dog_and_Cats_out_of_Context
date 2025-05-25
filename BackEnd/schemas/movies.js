// schemas/movies.js
import { z } from 'zod';

const movieSchema = z.object({
  title: z.string().max(75),
  date: z.string()
    .refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid date"
    })
    .transform(val => new Date(val)),
  description: z.string().max(700),
  duration: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Duration must be in HH:mm format"
  }),
  likes: z.number().int().min(0),
  notLikes: z.number().int().min(0),
  movie: z.string().url({ message: 'Movie must be a valid URL' }),
  user: z.string().uuid()
});

export function validateMovie(object) {
  return movieSchema.safeParse(object);
}

export function validatePartialMovie(object) {
  return movieSchema.partial().safeParse(object);
}
