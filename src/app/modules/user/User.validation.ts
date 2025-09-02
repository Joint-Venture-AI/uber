import { z } from 'zod';
import { EUserRole } from '../../../../prisma';
import { enum_encode } from '../../../util/transform/enum';

export const UserValidations = {
  register: z.object({
    body: z.object({
      name: z
        .string({ error: 'Name is missing' })
        .trim()
        .min(1, "Name can't be empty"),
      email: z.email({ error: 'Email is invalid' }).optional(),
      phone: z.string().optional(),
      password: z
        .string({ error: 'Password is missing' })
        .min(6, 'Password must be at least 6 characters long'),
    }),
  }),

  edit: z.object({
    body: z.object({
      name: z.string().optional(),
      avatar: z.string().optional(),
      phone: z.string().optional(),
      fcmToken: z.string().optional(),
      address: z.string().optional(),
    }),
  }),

  changePassword: z.object({
    body: z.object({
      oldPassword: z
        .string({
          error: 'Old Password is missing',
        })
        .min(1, 'Old Password is required')
        .min(6, 'Old Password must be at least 6 characters long'),
      newPassword: z
        .string({
          error: 'New Password is missing',
        })
        .min(1, 'New Password is required')
        .min(6, 'New Password must be at least 6 characters long'),
    }),
  }),

  getAllUser: z.object({
    query: z.object({
      search: z.string().trim().optional(),
      role: z
        .string()
        .optional()
        .transform(enum_encode)
        .pipe(z.enum(EUserRole).optional()),
    }),
  }),
};
