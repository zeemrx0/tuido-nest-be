import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, Inject } from '@nestjs/common';
import { IUserService } from '@user/domain/user.port';
import { UserLoginDto, UserRegistrationDto } from '@user/domain/user.dto';
import { JwtAuthGuard } from '@shared/guards';
import { CurrentUser } from '@shared/decorators';
import { TokenPayload } from '@shared/interfaces';

@Controller('v1')
export class UserController {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() data: UserRegistrationDto) {
    try {
      const userId = await this.userService.register(data);
      return { data: userId };
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: UserLoginDto) {
    try {
      const token = await this.userService.login(data);
      return { data: { token } };
    } catch (error) {
      throw error;
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getProfile(@CurrentUser() user: TokenPayload) {
    try {
      const profile = await this.userService.getProfile(user.subject);
      return { data: profile };
    } catch (error) {
      throw error;
    }
  }
}
