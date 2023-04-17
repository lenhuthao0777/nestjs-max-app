import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { HandleResponse } from '@src/common/helper.common';
import { compare, hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { AuthLoginDto } from './dto/login-auth.dto';
import { RegisterUserDto } from './dto/register-auth.dto';
import { MeType } from './dto/me.auth.dto';

type TToken = {
  email: string;
  name: string;
  role: number;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly UserModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(user: RegisterUserDto): Promise<any> {
    try {
      const numSaltRounds = 10;

      const hashPass: string = await hash(user.password, numSaltRounds);

      const checkUser: User = await this.UserModel.findOne({
        email: user.email,
      });

      if (checkUser) {
        return HandleResponse(HttpStatus.BAD_REQUEST, 'Email already exist');
      }

      // const token: string = await this.createToken({
      //   email: user.email,
      //   name: user.name,
      //   role: 1,
      // });

      const registerFc = new this.UserModel({
        ...user,
        password: hashPass,
      });

      const data: User = await registerFc.save();

      return HandleResponse(HttpStatus.OK, 'Register success!', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        // access_token: token,
        create_at: data.create_at,
        update_at: data.update_at,
      });
    } catch (error) {
      return error.message;
    }
  }

  async login(user: AuthLoginDto) {
    const checkUser: User = await this.validateUser(user.email, user.password);

    if (!checkUser) {
      return HandleResponse(
        HttpStatus.BAD_REQUEST,
        'Email or password is incorrect!',
      );
    }

    if (checkUser) {
      const payload: TToken = {
        email: checkUser.email,
        name: checkUser.name,
        role: 1,
      };

      const data = {
        name: checkUser.name,
        email: checkUser.email,
        role: 1,
        token: await this.createToken(payload, true),
        refresh_token: checkUser.refresh_token,
      };

      return HandleResponse(HttpStatus.OK, 'Login Success!', data);
    }
  }

  async me(user: MeType) {
    try {
      const me: User = await this.UserModel.findOne({
        email: user.email,
      }).exec();

      if (!me) {
        return HandleResponse(HttpStatus.UNAUTHORIZED);
      }

      return HandleResponse(HttpStatus.OK, 'Success!', me);
    } catch (error) {
      return error;
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user: User = await this.UserModel.findOne({
      email,
    }).exec();

    const checkPass = await compare(password, user.password);

    if (user && checkPass) {
      return user;
    }
    return null;
  }

  private async createToken(user: TToken, isLogin?: boolean) {
    const accessToken: string = await this.jwtService.sign(user);

    if (isLogin) {
      const refreshToken: string = await this.jwtService.sign(
        { user },
        {
          secret: process.env.SECRET,
          expiresIn: process.env.EXPIRESIN,
        },
      );

      const user1 = await this.UserModel.findOne({
        email: user.email,
      });

      console.log(refreshToken);

      console.log('user', user1);

      // await this.UserModel.findOneAndUpdate(
      //   {
      //     email: user.email,
      //   },
      //   { refresh_token: refreshToken },
      // );
    }

    return accessToken;
  }
}
