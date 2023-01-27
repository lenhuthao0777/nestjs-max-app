import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/login-auth.dto';
import { RegisterUserDto } from './dto/register-auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() user: RegisterUserDto) {
    return this.authService.register(user);
  }

  @Post('/login')
  login(@Body() user: AuthLoginDto): any {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/me')
  me(@Body() email: string) {
    return this.authService.me(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/test/:id')
  test() {
    return 'test';
  }
}
