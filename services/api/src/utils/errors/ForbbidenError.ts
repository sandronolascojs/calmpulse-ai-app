import { ErrorBase } from './error.base';
import { StatusCode } from './statusCode.enum';

export class ForbbidenError extends ErrorBase {
  constructor({ message }: { message: string }) {
    super({ message, statusCode: StatusCode.FORBIDDEN });
  }
}
