import { ErrorBase } from './error.base';
import { StatusCode } from './statusCode.enum';

export class UnauthorizedError extends ErrorBase {
  constructor({ message, path, userId }: { message: string; path: string; userId?: string }) {
    super({ message, statusCode: StatusCode.UNAUTHORIZED, path, userId });
  }
}
