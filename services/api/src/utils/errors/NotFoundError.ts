import { ErrorBase } from './error.base';
import { StatusCode } from './statusCode.enum';

export class NotFoundError extends ErrorBase {
  constructor({ message, path, userId }: { message: string; path?: string; userId?: string }) {
    super({ message, statusCode: StatusCode.NOT_FOUND, path, userId });
  }
}
