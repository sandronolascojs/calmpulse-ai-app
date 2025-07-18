import { ErrorBase } from './error.base.js';
import { StatusCode } from './statusCode.enum.js';

export class ForbiddenError extends ErrorBase {
  constructor({ message }: { message: string }) {
    super({ message, statusCode: StatusCode.FORBIDDEN });
  }
}
