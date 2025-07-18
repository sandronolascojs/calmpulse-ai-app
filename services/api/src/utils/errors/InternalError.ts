import { ErrorBase } from './error.base.js';
import { StatusCode } from './statusCode.enum.js';

export class InternalError extends ErrorBase {
  constructor({ message }: { message: string }) {
    super({
      message,
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
    });
  }
}
