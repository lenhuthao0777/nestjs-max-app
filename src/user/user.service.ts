import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HandleResponse } from '@src/common/helper.common';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  async users() {
    const data = await this.UserModel.find();
    return HandleResponse(HttpStatus.OK, 'Success!', data);
  }
}
