import { ErrorBase } from './error.base';
import { StatusCode } from './statusCode.enum';

export class InternalError extends ErrorBase {
  constructor({ message, path, userId }: { message: string; path: string; userId?: string }) {
    super({
      message,
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      path,
      userId,
    });
  }
}
