import { z } from 'zod';

export const AuthValidations = {
  login: z.object({
    body: z.object({
      email: z
        .email({
          error: 'Email is missing',
        })
        .optional(),
      password: z
        .string({
          error: 'Password is missing',
        })
        .min(6, 'Password must be at least 6 characters long'),
    }),
  }),

  resetPassword: z.object({
    body: z.object({
      password: z
        .string({ error: 'Password is missing' })
        .min(6, 'Password must be 6 characters long'),
    }),
  }),
};
