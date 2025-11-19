import { ConflictException, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';

export const firstNameAtLeast2Chars = new Error('First name must be at least 2 characters');
export const lastNameAtLeast2Chars = new Error('Last name must be at least 2 characters');
export const emailInvalid = new Error('Email is invalid');
export const passwordAtLeast6Chars = new Error('Password must be at least 6 characters');
export const roleInvalid = new Error('Role is invalid');
export const emailExisted = new ConflictException('Email is already existed');
export const invalidEmailAndPassword = new UnauthorizedException('Invalid email and password');
export const userInactivated = new ForbiddenException('User is inactivated or banned');
export const invalidToken = new UnauthorizedException('Invalid token');
export const userNotFound = new NotFoundException('User not found');
