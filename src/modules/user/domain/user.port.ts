import { UserLoginDto, UserRegistrationDto } from './user.dto';
import { User } from './user.model';

export interface IUserService {
  register(data: UserRegistrationDto): Promise<string>;
  login(data: UserLoginDto): Promise<string>;
  getProfile(userId: string): Promise<Omit<User, 'password' | 'salt'>>;
}
