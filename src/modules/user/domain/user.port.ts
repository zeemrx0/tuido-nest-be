import { UserConditionDto, UserLoginDto, UserRegistrationDto, UserUpdateDto } from '@user/domain/user.dto';
import { User } from '@user/domain/user.model';
import { IRepository } from '@shared/interfaces';

export const USER_REPOSITORY = Symbol('IUserRepository');
export const USER_SERVICE = Symbol('IUserService');

export interface IUserRepository extends IRepository<User, UserConditionDto, UserUpdateDto> {}

export interface IUserService {
  register(data: UserRegistrationDto): Promise<string>;
  login(data: UserLoginDto): Promise<string>;
  getProfile(userId: string): Promise<Omit<User, 'password' | 'salt'>>;
}
