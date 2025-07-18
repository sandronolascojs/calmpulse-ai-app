import { ErrorBase } from './error.base.js';
import { StatusCode } from './statusCode.enum.js';

export class ConflictError extends ErrorBase {
  constructor({ message }: { message: string }) {
    super({ message, statusCode: StatusCode.CONFLICT });
  }
}
