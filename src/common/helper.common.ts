import {
  BadRequestException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';

export const HandleResponse = (code?: number, message?: string, data?: any) => {
  switch (code) {
    case HttpStatus.OK:
      return {
        status: 'Ok',
        code,
        data,
        message,
      };

    case HttpStatus.CREATED:
      return {
        status: 'Success',
        code,
        data,
        message,
      };

    case HttpStatus.UNAUTHORIZED:
      throw new UnauthorizedException(message);

    case HttpStatus.BAD_REQUEST:
      throw new BadRequestException(message);

    default:
      break;
  }
};
