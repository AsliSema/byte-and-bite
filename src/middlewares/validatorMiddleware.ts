import { NextFunction, Request, Response } from '../types/express';
const { validationResult } = require('express-validator');
import { StatusCodes } from 'http-status-codes';

const validatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};

module.exports = validatorMiddleware;
