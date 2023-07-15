import { ErrorRequestHandler, NextFunction, Response } from 'express';

export interface ErrorResponse {
  data: any;
  success: boolean;
  error: boolean;
  message: string;
  status: number;
  stack?: string;
}
// @desc    This middleware handles errors by sending a JSON response with the error message, status code, and stack trace.
export const errorHandlerMiddleware: ErrorRequestHandler = (
  error,
  req,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  res?.status(statusCode).json({
    data: null,
    success: false,
    error: true,
    message: error.message || 'Internal Server Error',
    status: statusCode,
    stack: error.stack,
  });
};
