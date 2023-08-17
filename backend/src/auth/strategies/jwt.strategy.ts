import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { setValue } from 'express-ctx';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../dto';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService, configService: ConfigService) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate({ id }: IJwtPayload) {
    const user = await this.userService.findOne(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    setValue('user', { ...user, password: undefined });

    return user;
  }
}
