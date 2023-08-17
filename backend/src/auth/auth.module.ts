import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { FireBaseService } from './firebase-service';
import { FirebaseAuthStrategy } from './strategies/firebase-auth.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, FireBaseService, FirebaseAuthStrategy],
  exports: [AuthService, PassportModule, JwtStrategy, FirebaseAuthStrategy],
  imports: [
    forwardRef(() => UserModule),
    PassportModule.registerAsync({
      useFactory: () => ({ defaultStrategy: 'jwt' }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRY'),
        },
      }),
    }),
  ],
})
export class AuthModule {}
