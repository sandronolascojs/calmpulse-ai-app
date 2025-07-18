import { ErrorBase } from './error.base.js';
import { StatusCode } from './statusCode.enum.js';

export class UnauthorizedError extends ErrorBase {
  constructor({ message }: { message: string }) {
    super({ message, statusCode: StatusCode.UNAUTHORIZED });
  }
}
