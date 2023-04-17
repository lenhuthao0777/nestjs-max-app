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

    const dataResponse = data.map((item) => ({
      id: item._id,
      name: item.name,
      email: item.email,
      create_at: item.create_at,
      update_at: item.update_at,
    }));
    return HandleResponse(HttpStatus.OK, 'Success!', dataResponse);
  }

  async user(id: string) {
    const data = await this.UserModel.findById(id);

    return HandleResponse(HttpStatus.OK, 'Success!', data);
  }
}
