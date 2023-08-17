import { IsEmail, IsString } from 'class-validator';

export interface IJwtPayload {
  id: string;
  email: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export interface IFirebaseUser {
  name: string;
  auth_time: number;
  user_id: string;
  email: string;
  email_verified: boolean;
  firebase: {
    sign_in_provider: string;
    identities: Record<string, string[]>;
  };
  uid: string;
}
