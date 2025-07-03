import { ErrorBase } from './error.base';
import { StatusCode } from './statusCode.enum';

export class ForbbidenError extends ErrorBase {
  constructor({ message, path, userId }: { message: string; path: string; userId?: string }) {
    super({ message, statusCode: StatusCode.FORBIDDEN, path, userId });
  }
}
