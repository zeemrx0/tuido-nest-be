import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v7 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { User } from './user.model';
import { TokenPayload } from '../../../shared/interfaces';
import * as UserError from './errors';
import { Status } from './enums';
import { UserRole } from '../../../shared/enums';
import { UserLoginDto, UserLoginDtoSchema, UserRegistrationDto, UserRegistrationDtoSchema } from './user.dto';
import { IUserService } from './user.port';
import { MySQLUserRepository } from '../infrastructure/repositories/mysql';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly repository: MySQLUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: UserRegistrationDto): Promise<string> {
    const dto = UserRegistrationDtoSchema.parse(data);

    // 1. Check if email already exists
    const existedUser = await this.repository.findByCondition({
      email: dto.email,
    });
    if (existedUser) {
      throw UserError.emailExisted;
    }

    // 2. Generate salt and hash password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(`${dto.password}.${salt}`, 10);

    // 3. Create new user
    const newId = v7();
    const newUser: User = {
      ...dto,
      password: hashPassword,
      id: newId,
      status: Status.ACTIVE,
      salt: salt,
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 4. Insert new user to database
    await this.repository.insert(newUser);

    return newId;
  }

  async login(data: UserLoginDto): Promise<string> {
    const dto = UserLoginDtoSchema.parse(data);

    // 1. Find user by email
    const user = await this.repository.findByCondition({ email: dto.email });
    if (!user) {
      throw UserError.invalidEmailAndPassword;
    }

    // 2. Check if user is active
    if (user.status !== Status.ACTIVE) {
      throw UserError.userInactivated;
    }

    // 3. Verify password
    const isPasswordValid = await bcrypt.compare(`${dto.password}.${user.salt}`, user.password);

    if (!isPasswordValid) {
      throw UserError.invalidEmailAndPassword;
    }

    // 4. Generate JWT token
    const payload: TokenPayload = { subject: user.id };
    const token = await this.jwtService.signAsync(payload);

    return token;
  }

  async getProfile(userId: string): Promise<Omit<User, 'password' | 'salt'>> {
    // 1. Find user by ID
    const user = await this.repository.get(userId);
    if (!user) {
      throw UserError.userNotFound;
    }

    // 2. Check if user is active
    if (user.status !== Status.ACTIVE) {
      throw UserError.userInactivated;
    }

    // 3. Return user profile without sensitive data
    const { password, salt, ...profile } = user;
    return profile;
  }
}
