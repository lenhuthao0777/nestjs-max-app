import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { HandleResponse } from '@src/common/helper.common';
import { compare, hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { AuthLoginDto } from './dto/login-auth.dto';
import { RegisterUserDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly UserModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(user: RegisterUserDto): Promise<any> {
    const numSaltRounds = 10;

    const hashPass: string = await hash(user.password, numSaltRounds);

    const checkUser: User = await this.UserModel.findOne({ email: user.email });

    if (checkUser) {
      return HandleResponse(HttpStatus.BAD_REQUEST, 'Email already exist');
    }

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
    const checkUser: User = await this.UserModel.findOne({
      where: {
        email: user.email,
      },
    });

    if (!checkUser) {
      return HandleResponse(
        HttpStatus.BAD_REQUEST,
        'Email or password is incorrect!',
      );
    }
    const checkPass = await compare(user.password, checkUser.password);

    if (checkUser && checkPass) {
      const payload = {
        email: checkUser.email,
        name: checkUser.name,
        role: checkUser.role_id,
      };

      const data = {
        name: checkUser.name,
        email: checkUser.email,
        role: 1,
        token: await this.jwtService.signAsync(payload),
        refresh_token: '',
      };

      return HandleResponse(HttpStatus.OK, 'Login Success!', data);
    }
  }

  async me(email: string) {
    const me: User = await this.UserModel.findOne({ where: { email } });

    if (!me) {
      return HandleResponse(HttpStatus.UNAUTHORIZED);
    }

    return HandleResponse(HttpStatus.OK, 'Success!', me);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user: User = await this.UserModel.findOne({
      where: {
        email,
      },
    });

    const checkPass = await compare(password, user.password);

    if (user && checkPass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
