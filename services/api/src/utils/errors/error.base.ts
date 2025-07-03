import type { StatusCode } from './statusCode.enum';

export class ErrorBase extends Error {
  statusCode: StatusCode;
  path: string;
  userId?: string;

  constructor({
    message,
    statusCode,
    path = 'unknown',
    userId = 'unknown',
  }: {
    message: string;
    statusCode: number;
    path?: string;
    userId?: string;
  }) {
    super(message);
    this.statusCode = statusCode;
    this.path = path;
    this.userId = userId;
  }
}
