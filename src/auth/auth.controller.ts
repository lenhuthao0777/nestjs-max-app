import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/login-auth.dto';
import { RegisterUserDto } from './dto/register-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  // @HttpCode(HttpStatus.OK)
  register(@Body() user: RegisterUserDto) {
    return this.authService.register(user);
  }

  @Post('/login')
  login(@Body() user: AuthLoginDto) {
    return this.authService.login(user);
  }

  @Post('/me')
  me(@Body() email: string) {
    return this.authService.me(email);
  }
}
