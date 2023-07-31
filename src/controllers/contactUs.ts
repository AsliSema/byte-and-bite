import { NextFunction, Request, Response } from '../types/express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import { ApiError } from '../utils/apiError';
import { sendEmailContact } from '../utils/sendEmail';

const contactUs = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { fullName, email, phone, message } = req.body;
  try {
    await sendEmailContact({
      fullName,
      email,
      phone,
      subject: `B&B New Message| ${fullName}`,
      message,
    });
  } catch (error: any) {
    return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `error : ${error.message}`));
  }

  res.status(StatusCodes.OK).send('Message Sent Successfully!');
});

export { contactUs };
