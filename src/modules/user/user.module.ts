import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from '@user/infrastructure/transports/user-http.controller';
import { UserService } from '@user/domain/user.service';
import { MySQLUserRepository } from '@user/infrastructure/repositories/mysql';
import { jwtConfig } from '@shared/config';

@Module({
  imports: [JwtModule.register(jwtConfig)],
  controllers: [UserController],
  providers: [
    {
      provide: 'IUserService',
      useClass: UserService,
    },
    MySQLUserRepository,
  ],
  exports: ['IUserService'],
})
export class UserModule {}
