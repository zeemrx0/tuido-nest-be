import { z } from 'zod';
import * as UserError from '@user/domain/errors';
import { Status } from '@user/domain/enums';
import { UserRole } from '@shared/enums';

export const userSchema = z.object({
  id: z.uuid(),
  avatar: z.string().nullable().optional(),
  firstName: z.string().min(2, { message: UserError.firstNameAtLeast2Chars.message }),
  lastName: z.string().min(2, { message: UserError.lastNameAtLeast2Chars.message }),
  email: z.email({ message: UserError.emailInvalid.message }),
  password: z.string().min(6, { message: UserError.passwordAtLeast6Chars.message }),
  salt: z.string().min(8),
  phoneNumber: z.string().nullable().optional(),
  role: z.enum(UserRole, { message: UserError.roleInvalid.message }),
  status: z.enum(Status).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;
