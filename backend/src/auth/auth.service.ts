import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateUserDto,
  CreateUserThirdPartyDto,
} from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { IJwtPayload, LoginDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { getValue } from 'express-ctx';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userSerice: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(payload: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    payload.password = await bcrypt.hash(payload.password, salt);

    return this.userSerice.create(payload);
  }

  async login(values: LoginDto) {
    const user = await this.userSerice.findOneBy({
      where: { email: values.email },
    });

    if (user) {
      const validPassword = await bcrypt.compare(
        values.password,
        user.password,
      );

      // valid user
      if (validPassword) {
        const token = await this.issueToken({
          email: user.email,
          id: user.id,
        });
        return {
          token,
          user,
        };
      }

      throw new UnauthorizedException('Incorrect email or password');
    }

    throw new NotFoundException('Unauthorized');
  }

  async thirdPartyAuthLogin() {
    const firebaseUser: DecodedIdToken = getValue('user');

    const user = await this.userSerice.findOneBy({
      where: { thirdPartyUUID: firebaseUser.uid },
    });

    if (!user) {
      throw new NotFoundException('Unauthorized');
    }

    const token = await this.issueToken({
      email: user.email,
      id: user.id,
    });

    return { token, user };
  }

  async thirdPartyAuth(payload: CreateUserThirdPartyDto) {
    const firebaseUser: DecodedIdToken = getValue('user');

    return this.userSerice.create({
      email: firebaseUser.email,
      name: firebaseUser.name,
      thirdPartyUUID: firebaseUser.uid,
      phone: payload.phone,
    });
  }

  private issueToken(payload: IJwtPayload) {
    return this.jwtService.sign(payload);
  }
}
