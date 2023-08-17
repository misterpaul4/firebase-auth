import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import { FireBaseService } from '../firebase-service';
import { setValue } from 'express-ctx';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  constructor(private readonly firebaseService: FireBaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(token: string) {
    const firebaseUser: DecodedIdToken = await admin.apps[0]
      .auth()
      .verifyIdToken(token)
      .catch((err) => {
        console.log(err);
        throw new UnauthorizedException('Invalid Token');
      });
    if (!firebaseUser) {
      throw new UnauthorizedException();
    }

    setValue('user', firebaseUser);
    return firebaseUser;
  }
}
