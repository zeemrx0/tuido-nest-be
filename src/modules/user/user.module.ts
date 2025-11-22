import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from '@user/infrastructure/transports/user-http.controller';
import { UserService } from '@user/domain/user.service';
import { MySQLUserRepository } from '@user/infrastructure/repositories/mysql';
import { jwtConfig } from '@shared/config';
import { USER_SERVICE, USER_REPOSITORY } from '@user/domain/user.port';

@Module({
  imports: [JwtModule.register(jwtConfig)],
  controllers: [UserController],
  providers: [
    {
      provide: USER_SERVICE,
      useClass: UserService,
    },
    {
      provide: USER_REPOSITORY,
      useClass: MySQLUserRepository,
    },
    MySQLUserRepository,
  ],
})
export class UserModule {}
