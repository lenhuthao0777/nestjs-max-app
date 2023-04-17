import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  users() {
    return this.userService.users();
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-id')
  user(@Query('id') id: string) {
    return this.userService.user(id);
  }
}
