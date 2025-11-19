import { z } from 'zod';
import { userSchema } from './user.model';
import { Status } from './enums';
import * as UserError from './errors';
import { UserRole } from '@shared/enums';

// User Registration DTO
export const UserRegistrationDtoSchema = userSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  password: true,
});

export type UserRegistrationDto = z.infer<typeof UserRegistrationDtoSchema>;

// User Login DTO
export const UserLoginDtoSchema = userSchema.pick({
  email: true,
  password: true,
});

export type UserLoginDto = z.infer<typeof UserLoginDtoSchema>;

// User Update DTO
export const userUpdateDtoSchema = z.object({
  avatar: z.string().nullable().optional(),
  firstName: z.string().min(2, { message: UserError.firstNameAtLeast2Chars.message }).optional(),
  lastName: z.string().min(2, { message: UserError.lastNameAtLeast2Chars.message }).optional(),
  email: z.email({ message: UserError.emailInvalid.message }).optional(),
  password: z.string().min(6, { message: UserError.passwordAtLeast6Chars.message }).optional(),
  salt: z.string().min(8).optional(),
  phoneNumber: z.string().nullable().optional(),
  role: z.enum(UserRole, { message: UserError.roleInvalid.message }).optional(),
  status: z.enum(Status).optional(),
});

export type UserUpdateDto = z.infer<typeof userUpdateDtoSchema>;

// User Condition DTO
export const userConditionDtoSchema = z.object({
  firstName: z.string().min(2, { message: UserError.firstNameAtLeast2Chars.message }).optional(),
  lastName: z.string().min(2, { message: UserError.lastNameAtLeast2Chars.message }).optional(),
  email: z.email({ message: UserError.emailInvalid.message }).optional(),
  phoneNumber: z.string().nullable().optional(),
  role: z.enum(UserRole, { message: UserError.roleInvalid.message }).optional(),
  status: z.enum(Status).optional(),
});

export type UserConditionDto = z.infer<typeof userConditionDtoSchema>;
