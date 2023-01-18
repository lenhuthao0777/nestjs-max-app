import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HandleResponse } from '@src/common/helper.common';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { AuthLoginDto } from './dto/login-auth.dto';
import { RegisterUserDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  register(user: RegisterUserDto): Promise<any> {
    const registerFc = new this.UserModel(user);
    return registerFc.save();
  }

  async login(user: AuthLoginDto) {
    const checkUser: User = await this.UserModel.findOne({ email: user.email });
    if (!checkUser) {
      return HandleResponse(
        HttpStatus.BAD_REQUEST,
        'Email or password is incorrect!',
      );
    }
    const data = {
      name: checkUser.name,
      email: checkUser.email,
      role: 1,
      token: 'this is the token :))',
      refresh_token: 'this is the refresh token :))',
    };

    return HandleResponse(HttpStatus.OK, 'Login Success!', data);
  }
}
