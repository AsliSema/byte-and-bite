// @desc    this class is responsible for operational errors (errors i can predict)

export class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);

    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
