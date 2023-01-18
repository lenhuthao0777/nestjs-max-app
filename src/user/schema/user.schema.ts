import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: [true, 'name is not empty!'] })
  name: string;

  @Prop({ required: [true, 'name is not empty!'], unique: true })
  email: string;

  @Prop()
  phone!: string;

  @Prop()
  password: string;

  @Prop()
  role_id: string;

  @Prop({ default: Date.now })
  create_at?: Date;

  @Prop({ default: Date.now })
  update_at?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
