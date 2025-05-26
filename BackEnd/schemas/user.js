// schemas/user.js
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8)
});

export function validateUser(object) {
  return userSchema.safeParse(object);
}

export function validatePartialUser(object) {
  return userSchema.partial().safeParse(object);
}   