import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  CreateUserThirdPartyDto,
} from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto';
import { FirebaseAuthGuard } from 'src/lib/guards/firebase-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('third-party-auth-sign-up')
  thirdPartyAuth(@Body() body: CreateUserThirdPartyDto) {
    return this.authService.thirdPartyAuth(body);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('third-party-auth-login')
  thirdPartyAuthLogin() {
    return this.authService.thirdPartyAuthLogin();
  }
}
