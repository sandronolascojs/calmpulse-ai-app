import { ErrorBase } from './error.base.js';
import { StatusCode } from './statusCode.enum.js';

export class NotFoundError extends ErrorBase {
  constructor({ message }: { message: string }) {
    super({ message, statusCode: StatusCode.NOT_FOUND });
  }
}
