import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HandleResponse } from '@src/common/helper.common';
import { hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { AuthLoginDto } from './dto/login-auth.dto';
import { RegisterUserDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  async register(user: RegisterUserDto): Promise<any> {
    const numSaltRounds = 10;

    const hashPass: string = await hash(user.password, numSaltRounds);

    const registerFc = new this.UserModel({ ...user, password: hashPass });

    const data: User = await registerFc.save();

    return HandleResponse(HttpStatus.OK, 'Register success!', {
      name: data.name,
      email: data.email,
      phone: data.phone,
      create_at: data.create_at,
      update_at: data.update_at,
    });
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
